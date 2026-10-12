import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { CreateCommentDTO } from './dto/create-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('feedbacks/:feedbackId/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('feedbackId') feedbackId: string,
    @Body() dto: CreateCommentDTO,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.commentsService.createComment(req.user, feedbackId, dto);
  }

  @Get('feedbacks/:feedbackId/comments')
  @UseGuards(OptionalJwtAuthGuard)
  async getComments(@Param('feedbackId') feedbackId: string) {
    return await this.commentsService.getCommentsForFeedback(feedbackId);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.commentsService.deleteComment(id, req.user);
  }
}
