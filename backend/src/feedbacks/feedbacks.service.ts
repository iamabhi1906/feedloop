import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Feedback from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dto/create.dto';
import User from '../users/entities/user.entity';
import { TagsService } from '../tags/tags.service';
import { FeedbackQueryDTO } from './dto/quary.dto';
import FeedbackVisibility from './enums/feedback-visibility.enum';

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

  async findAll(query: FeedbackQueryDTO) {
    const { sort = 'desc', page = 1, limit = 10 } = query;
    const qb = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .leftJoinAndSelect('feedback.tags', 'tag')
      .leftJoin('feedback.votes', 'vote')
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
      qb.andWhere('tag.id IN (:...tags)', { tag: query.tags });
    }

    if (query.authors?.length) {
      qb.andWhere('feedback.userId IN (:...authors)', {
        authors: query.authors,
      });
    }

    qb.addSelect(
      `
      COALESCE(
        SUM(
          CASE
            WHEN vote.type = 'UPVOTE' THEN 1
            WHEN vote.type = 'DOWNVOTE' THEN -1
            ELSE 0
          END
        ),
        0
      )
      `,
      'score',
    )
      .groupBy('feedback.id')
      .addGroupBy('user.id')
      .addGroupBy('tag.id')
      .orderBy('score', sort.toUpperCase() as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await Promise.all([
      qb.getMany(),
      qb.clone().getCount(),
    ]);

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
}
