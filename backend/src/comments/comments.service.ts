import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from './entities/comment.entity';
import { Repository } from 'typeorm';
import Feedback from '../feedbacks/entities/feedback.entity';
import User from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async createComment(
    user: User,
    feedbackId: string,
    dto: CreateCommentDTO,
  ): Promise<Comment> {
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admins are not allowed to comment on feedback');
    }
    if (user.isLoginDisabled) {
      throw new ForbiddenException('Your account has been disabled');
    }

    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId, isDeleted: false },
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (dto.parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: dto.parentId, feedbackId, isDeleted: false },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    const comment = this.commentRepository.create({
      content: dto.content.trim(),
      feedbackId,
      userId: user.id,
      parentId: dto.parentId || null,
      user,
    });

    const saved = await this.commentRepository.save(comment);
    return saved;
  }

  async getCommentsForFeedback(
    feedbackId: string,
    user?: User,
    includeDeletedComments?: boolean,
  ) {
    const isAdmin = user?.role === UserRole.ADMIN;
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.feedbackId = :feedbackId', { feedbackId });

    if (!isAdmin || !includeDeletedComments) {
      qb.andWhere('comment.isDeleted = false');
    }

    if (!isAdmin) {
      qb.andWhere('(user.hideComments = false OR user.hideComments IS NULL)');
    }

    qb.orderBy('comment.createdAt', 'ASC');

    const comments = await qb.getMany();

    // Format comments and hide password
    const formattedComments = comments.map((c) => {
      const { password, ...userWithoutPassword } = c.user || {};
      return {
        id: c.id,
        feedbackId: c.feedbackId,
        userId: c.userId,
        parentId: c.parentId,
        content: c.content,
        isDeleted: c.isDeleted,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user: userWithoutPassword,
      };
    });

    // Build hierarchical comment tree for self-relation structure
    const map = new Map<string, any>();
    const roots: any[] = [];

    formattedComments.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    formattedComments.forEach((c) => {
      const node = map.get(c.id);
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async deleteComment(commentId: string, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, isDeleted: false },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    comment.isDeleted = true;
    await this.commentRepository.save(comment);
    return { success: true, message: 'Comment deleted successfully' };
  }
}
