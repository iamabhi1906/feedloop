import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Feedback from './entities/feedback.entity';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dto/create.dto';
import User from '../users/entities/user.entity';
import { TagsService } from '../tags/tags.service';
import { FeedbackQueryDTO } from './dto/query.dto';
import { VoteType } from '../votes/enums/vote-type.enum';
import FeedbackVisibility from './enums/feedback-visibility.enum';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly tagsService: TagsService,
  ) {}

  private readonly logger = new Logger(FeedbacksService.name);

  async createFeedBack(
    user: User,
    createFeedbackDTO: CreateFeedbackDTO,
  ): Promise<Feedback> {
    if (user.isLoginDisabled) {
      throw new ForbiddenException('Your account has been disabled');
    }

    const tags = await this.tagsService.getTagList(createFeedbackDTO.tags);

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDTO,
      tags,
      user,
    });
    return await this.feedbackRepository.save(feedback);
  }

  async findAll(query: FeedbackQueryDTO, user?: User) {
    this.logger.verbose('A Debug log');
    const { page = 1, limit = 10, sort = 'desc' } = query;
    const where: FindOptionsWhere<Feedback> = {
      isDeleted: false,
      visibility: FeedbackVisibility.PUBLIC,
      user: { hideFeedbacks: false },
    };
    if (query.search) where.title = ILike(`%${query.search}%`);

    if (query.authors?.length) {
      where.user = {
        hideFeedbacks: false,
        id: In(query.authors),
      };
    }

    if (query.tags?.length) where.tags = { id: In(query.tags) };

    const [feedbacks, total] = await this.feedbackRepository.findAndCount({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, username: true, name: true },
        tags: { id: true, name: true },
      },
      relations: { user: true, tags: true, votes: true, comments: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    const data: Array<
      Feedback & {
        score: number;
        userVote: VoteType | null;
        commentCount: number;
      }
    > = [];
    for (const feedback of feedbacks) {
      let score = 0;
      let userVote: VoteType | null = null;
      for (const vote of feedback.votes ?? []) {
        if (vote.type === VoteType.UPVOTE) score++;
        if (vote.type === VoteType.DOWNVOTE) score--;
        if (vote.userId === user?.id) {
          userVote = vote.type;
        }
      }
      const commentCount =
        feedback.comments?.filter((comment) => !comment.isDeleted).length ?? 0;
      data.push({
        ...feedback,
        score,
        userVote,
        commentCount,
      });
    }
    data.sort((a, b) =>
      sort === 'asc' ? a.score - b.score : b.score - a.score,
    );
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
      where: {
        id,
        isDeleted: false,
        visibility: FeedbackVisibility.PUBLIC,
        user: { hideFeedbacks: false },
      },
      select: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, username: true, name: true },
        tags: { id: true, name: true },
      },
      relations: { user: true, tags: true, votes: true, comments: true },
    });

    if (!feedback) throw new NotFoundException('Feedback not found');

    let score = 0;
    let userVote: VoteType | null = null;
    for (const vote of feedback.votes ?? []) {
      if (vote.type === VoteType.UPVOTE) score++;
      if (vote.type === VoteType.DOWNVOTE) score--;
      if (vote.userId === user?.id) {
        userVote = vote.type;
      }
    }
    const commentCount =
      feedback.comments?.filter((comment) => !comment.isDeleted).length ?? 0;
    return {
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      visibility: feedback.visibility,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      user: feedback.user,
      tags: feedback.tags,
      score,
      userVote,
      commentCount,
    };
  }

  async findAllMe(query: FeedbackQueryDTO, user: User) {
    console.log(user);
    const { page = 1, limit = 10, sort = 'desc' } = query;
    const where: FindOptionsWhere<Feedback> = {
      visibility: FeedbackVisibility.PUBLIC,
      userId: user.id,
    };
    if (query.search) where.title = ILike(`%${query.search}%`);

    if (query.authors?.length) {
      where.user = {
        hideFeedbacks: false,
        username: In(query.authors),
      };
    }

    if (query.tags?.length) where.tags = { id: In(query.tags) };

    const [feedbacks, total] = await this.feedbackRepository.findAndCount({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        user: { id: true, username: true, name: true },
        tags: { id: true, name: true },
      },
      relations: { user: true, tags: true, votes: true, comments: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    const data: Array<
      Feedback & {
        score: number;
        userVote: VoteType | null;
        commentCount: number;
      }
    > = [];
    for (const feedback of feedbacks) {
      let score = 0;
      let userVote: VoteType | null = null;
      for (const vote of feedback.votes ?? []) {
        if (vote.type === VoteType.UPVOTE) score++;
        if (vote.type === VoteType.DOWNVOTE) score--;
        if (vote.userId === user?.id) {
          userVote = vote.type;
        }
      }
      const commentCount =
        feedback.comments?.filter((comment) => !comment.isDeleted).length ?? 0;
      data.push({
        ...feedback,
        score,
        userVote,
        commentCount,
      });
    }
    data.sort((a, b) =>
      sort === 'asc' ? a.score - b.score : b.score - a.score,
    );
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
