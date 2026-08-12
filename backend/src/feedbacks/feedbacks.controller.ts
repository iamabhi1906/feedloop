import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../guards/jwt-auth.guard';
import { CreateFeedbackDTO } from './dto/create.dto';
import { FeedbackQueryDTO } from './dto/quary.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedBackService: FeedbacksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFeedback(
    @Body() body: CreateFeedbackDTO,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.feedBackService.createFeedBack(request.user, body);
  }

  @Get()
  async getFeedbacks(@Query() query: FeedbackQueryDTO) {
    return await this.feedBackService.findAll(query);
  }
}
