import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    let token: string | undefined;
    if (request.cookies && request.cookies['access_token']) {
      token = request.cookies['access_token'] as string;
    } else if (request.headers.authorization) {
      const parts = request.headers.authorization.split(' ');
      if (parts[0] === 'Bearer' && parts[1]) {
        token = parts[1];
      }
    }
    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      const user = await this.userService.findById(payload.sub);
      if (!user)
        throw new UnauthorizedException(
          'Invalid or expired authentication token',
        );
      request.user = user;
      return true;
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}
