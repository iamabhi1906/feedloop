import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [JwtAuthGuard, OptionalJwtAuthGuard],
  controllers: [],
  exports: [JwtAuthGuard, OptionalJwtAuthGuard, UsersModule, TokenModule],
})
export class GuardsModule {}

