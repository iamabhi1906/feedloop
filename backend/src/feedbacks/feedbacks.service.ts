/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Feedback from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dto/create.dto';
import User from '../users/entities/user.entity';
import { TagsService } from '../tags/tags.service';
import { FeedbackQueryDTO } from './dto/query.dto';
import FeedbackVisibility from './enums/feedback-visibility.enum';
import { VoteType } from '../votes/enums/vote-type.enum';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly tagService: TagsService,
  ) {}

  async createFeedBack(user: User, payload: CreateFeedbackDTO) {
    const tags = await this.tagService.getTagList(payload.tags);
    const newFeedback = this.feedbackRepository.create({
      title: payload.title,
      description: payload.description,
      visibility: payload.visibility,
      tags: tags,
      user: user,
    });
    newFeedback.user = user;
    return await this.feedbackRepository.save(newFeedback);
  }

  async findAll(query: FeedbackQueryDTO, user?: User) {
    const { sort = 'desc', page = 1, limit = 10 } = query;
    const qb = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.tags', 'tag')
      .leftJoinAndSelect('feedback.votes', 'vote')
      .where('feedback.isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .andWhere('feedback.visibility = :visibility', {
        visibility: FeedbackVisibility.PUBLIC,
      });

    if (query.search) {
      qb.andWhere(
        '(feedback.title ILIKE :search OR feedback.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.tags?.length) {
      console.log(query.tags);
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

      const { votes: _, ...rest } = feedback;
      return {
        ...rest,
        score,
        userVote,
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
      relations: { user: true, tags: true, votes: true },
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
    const { votes: _, ...rest } = feedback;
    return {
      ...rest,
      score,
      userVote,
    };
  }
}
