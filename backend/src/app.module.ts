import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { GuardsModule } from './guards/guards.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './database/config/orm.config';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync(ormConfig),
    UsersModule,
    AuthModule,
    TokenModule,
    GuardsModule,
    FeedbacksModule,
    TagsModule,
    CommentsModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
