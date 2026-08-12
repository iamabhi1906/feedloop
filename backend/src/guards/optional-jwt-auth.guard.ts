import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export interface OptionalAuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<OptionalAuthenticatedRequest>();

    let token: string | undefined;

    if (request.cookies && request.cookies['access_token']) {
      token = request.cookies['access_token'] as string;
    } else if (request.headers.authorization) {
      const parts = request.headers.authorization.split(' ');
      if (parts[0] === 'Bearer' && parts[1]) {
        token = parts[1];
      }
    }

    if (token) {
      try {
        const payload = await this.tokenService.verifyAccessToken(token);
        const user = await this.userService.findById(payload.sub);
        if (user) {
          request.user = user;
        }
      } catch {
        // no issue
      }
    }

    return true;
  }
}
