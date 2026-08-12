import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenModule } from '../token/token.module';
import { PasswordService } from './password/password.service';
import { CookieService } from './cookie.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [UsersModule, TokenModule, PasswordModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, CookieService, JwtAuthGuard],
  exports: [AuthService, CookieService, JwtAuthGuard],
})
export class AuthModule {}
