import {
  Body,
  Controller,
  Get,
  Param,
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
import {
  OptionalJwtAuthGuard,
  type OptionalAuthenticatedRequest,
} from '../guards/optional-jwt-auth.guard';
import { CreateFeedbackDTO } from './dto/create.dto';
import { FeedbackQueryDTO } from './dto/query.dto';

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
  @UseGuards(OptionalJwtAuthGuard)
  async getFeedbacks(
    @Query() query: FeedbackQueryDTO,
    @Req() request: OptionalAuthenticatedRequest,
  ) {
    console.log(query);
    return await this.feedBackService.findAll(query, request.user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getFeedbackOfMe(
    @Query() query: FeedbackQueryDTO,
    @Req() request: AuthenticatedRequest,
  ) {
    console.log('i am hit');
    return this.feedBackService.findAllMe(query, request.user);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getFeedback(
    @Param('id') id: string,
    @Req() request: OptionalAuthenticatedRequest,
  ) {
    return await this.feedBackService.findOne(id, request.user);
  }
}
