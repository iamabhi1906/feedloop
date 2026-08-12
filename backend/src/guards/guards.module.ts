import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [JwtAuthGuard],
  controllers: [],
  exports: [JwtAuthGuard, UsersModule, TokenModule],
})
export class GuardsModule {}
