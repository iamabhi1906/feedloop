import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { type Response, type Request } from 'express';
import { CookieService } from './cookie.service';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDTO) {
    const user = await this.authService.signup(signupDto);
    return {
      status: 'success',
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    };
  }

  @Post('signin')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    if (result.status === 'SESSION_LIMIT_EXCEEDED') return result;
    if (result.tokens)
      this.cookieService.setAuthCookies(
        response,
        result.tokens.accessToken,
        result.tokens.refreshToken,
      );

    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest) {
    return {
      status: 'success',
      user: request.user,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = (request.cookies || {}) as Record<string, unknown>;
    const refreshToken = cookies.refresh_token;
    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token required');
    }
    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    this.cookieService.setAccessToken(response, accessToken);
    return {
      status: 'success',
      message: 'Access token refreshed successfully',
    };
  }

  @Post('signout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) response: Response) {
    this.cookieService.clearAuthCookies(response);
    return {
      status: 'success',
      message: 'Logout successful',
    };
  }
}
