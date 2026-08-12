import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import Tag from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { GuardsModule } from '../guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), UsersModule, GuardsModule],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}
