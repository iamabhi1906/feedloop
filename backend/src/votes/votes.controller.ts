import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../guards/jwt-auth.guard';
import { VoteDto } from './dto/vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async vote(@Req() req: AuthenticatedRequest, @Body() body: VoteDto) {
    return await this.votesService.vote(
      req.user.id,
      body.feedbackId,
      body.type,
    );
  }
}
