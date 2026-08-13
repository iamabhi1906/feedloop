import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [JwtAuthGuard, OptionalJwtAuthGuard, AdminGuard],
  controllers: [],
  exports: [JwtAuthGuard, OptionalJwtAuthGuard, AdminGuard, UsersModule, TokenModule],
})
export class GuardsModule {}


