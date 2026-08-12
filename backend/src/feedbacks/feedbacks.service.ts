/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Feedback from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dto/create.dto';
import User from '../users/entities/user.entity';
import { TagsService } from '../tags/tags.service';
import { FeedbackQueryDTO } from './dto/query.dto';
import { VoteType } from '../votes/enums/vote-type.enum';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly tagsService: TagsService,
  ) {}

  async createFeedBack(
    user: User,
    createFeedbackDTO: CreateFeedbackDTO,
  ): Promise<Feedback> {
    const tags = await this.tagsService.getTagList(createFeedbackDTO.tags);

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDTO,
      tags,
      user,
    });
    return await this.feedbackRepository.save(feedback);
  }

  async findAll(query: FeedbackQueryDTO, user?: User) {
    const { page = 1, limit = 10, sort = 'desc' } = query;

    const qb = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.tags', 'tag')
      .leftJoinAndSelect('feedback.votes', 'vote')
      .leftJoinAndSelect(
        'feedback.comments',
        'comment',
        'comment.isDeleted = false',
      )
      .where('feedback.isDeleted = false');

    if (query.search) {
      qb.andWhere(
        '(feedback.title ILIKE :search OR feedback.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.tags?.length) {
      qb.andWhere('(tag.id IN (:...tags) OR tag.name IN (:...tags))', {
        tags: query.tags,
      });
    }

    if (query.authors?.length) {
      qb.andWhere(
        '(feedback.userId IN (:...authors) OR user.username IN (:...authors) OR user.name IN (:...authors))',
        {
          authors: query.authors,
        },
      );
    }

    qb.addSelect(
      `(
        SELECT COALESCE(
          SUM(
            CASE
              WHEN v.type = 'UPVOTE' THEN 1
              WHEN v.type = 'DOWNVOTE' THEN -1
              ELSE 0
            END
          ),
          0
        )
        FROM votes v
        WHERE v."feedbackId" = feedback.id
      )`,
      'score_calc',
    )
      .orderBy('score_calc', sort.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rawFeedbacks, total] = await qb.getManyAndCount();

    const data = rawFeedbacks.map((feedback) => {
      const votes = feedback.votes || [];
      const score = votes.reduce((acc, v) => {
        if (v.type === VoteType.UPVOTE) return acc + 1;
        if (v.type === VoteType.DOWNVOTE) return acc - 1;
        return acc;
      }, 0);

      const userVote = user
        ? (votes.find((v) => v.userId === user.id)?.type ?? null)
        : null;

      const commentCount = (feedback.comments || []).length;
      const { votes: _, comments: __, ...rest } = feedback;
      return {
        ...rest,
        score,
        userVote,
        commentCount,
      };
    });
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user?: User) {
    const feedback = await this.feedbackRepository.findOne({
      where: { id, isDeleted: false },
      relations: { user: true, tags: true, votes: true, comments: true },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    const votes = feedback.votes || [];
    const score = votes.reduce((acc, v) => {
      if (v.type === VoteType.UPVOTE) return acc + 1;
      if (v.type === VoteType.DOWNVOTE) return acc - 1;
      return acc;
    }, 0);

    const userVote = user
      ? (votes.find((v) => v.userId === user.id)?.type ?? null)
      : null;

    const commentCount = (feedback.comments || []).filter(
      (c) => !c.isDeleted,
    ).length;
    const { votes: _, comments: __, ...rest } = feedback;
    return {
      ...rest,
      score,
      userVote,
      commentCount,
    };
  }

  async findAllMe(query: FeedbackQueryDTO, user: User) {
    const { page = 1, limit = 10, sort = 'desc' } = query;
    const qb = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.tags', 'tag')
      .leftJoinAndSelect('feedback.votes', 'vote')
      .leftJoinAndSelect(
        'feedback.comments',
        'comment',
        'comment.isDeleted = false',
      )
      .where('feedback.isDeleted = false')
      .andWhere('feedback.userId = :userId', { userId: user.id });

    if (query.search) {
      qb.andWhere(
        '(feedback.title ILIKE :search OR feedback.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.tags?.length) {
      qb.andWhere('(tag.id IN (:...tags) OR tag.name IN (:...tags))', {
        tags: query.tags,
      });
    }
    const allFeedbacks = await qb.getMany();
    const formattedData = allFeedbacks.map((feedback) => {
      const votes = feedback.votes || [];
      const score = votes.reduce((acc, v) => {
        if (v.type === VoteType.UPVOTE) return acc + 1;
        if (v.type === VoteType.DOWNVOTE) return acc - 1;
        return acc;
      }, 0);

      const commentCount = (feedback.comments || []).length;
      const { votes: _, comments: __, ...rest } = feedback;

      return { ...rest, score, commentCount };
    });

    // 5. Sort by score in memory
    formattedData.sort((a, b) => {
      return sort.toLowerCase() === 'desc'
        ? b.score - a.score
        : a.score - b.score;
    });

    // 6. Paginate the sorted array
    const total = formattedData.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = formattedData.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
