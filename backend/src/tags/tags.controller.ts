import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../guards/jwt-auth.guard';
import { CreateTagDTO } from './dto/create.dto';
import { TagQueryDTO } from './dto/query.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateTagDTO,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.tagService.create(body, request.user);
  }

  @Get()
  async getAllTags(@Query() query: TagQueryDTO) {
    return await this.tagService.findAll(query);
  }
}
