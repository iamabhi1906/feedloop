import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieService {
  private readonly isProd = process.env.NODE_ENV === 'production';

  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: this.isProd,
    sameSite: this.isProd ? 'none' : 'lax',
  };

  setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie('access_token', accessToken, {
      ...this.cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  setAccessToken(response: Response, accessToken: string) {
    response.cookie('access_token', accessToken, {
      ...this.cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
  }

  clearAuthCookies(response: Response) {
    response.clearCookie('access_token', this.cookieOptions);
    response.clearCookie('refresh_token', this.cookieOptions);
  }
}
