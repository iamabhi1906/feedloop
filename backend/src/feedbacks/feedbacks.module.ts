import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import Feedback from './entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from '../tags/tags.module';
import { GuardsModule } from '../guards/guards.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
    TagsModule,
    GuardsModule,
    UsersModule,
  ],
  providers: [FeedbacksService],
  controllers: [FeedbacksController],
})
export class FeedbacksModule {}
