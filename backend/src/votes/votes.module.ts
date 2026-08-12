import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import Vote from './entities/votes.entity';
import Feedback from '../feedbacks/entities/feedback.entity';
import { GuardsModule } from '../guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Feedback]), GuardsModule],
  providers: [VotesService],
  controllers: [VotesController],
  exports: [VotesService],
})
export class VotesModule {}
