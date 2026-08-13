import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { TokenService } from '../token/token.service';
import { PasswordService } from './password/password.service';
import User from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async signup(signupDto: SignupDTO): Promise<User> {
    const existingUser = await this.usersService.create(signupDto);
    return existingUser;
  }

  async login(loginDto: LoginDTO) {
    const identifier = loginDto.username || loginDto.email;
    if (!identifier) {
      throw new BadRequestException('Email or Username is required');
    }
    const user = await this.usersService.findByEmailOrUsername(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials..!');

    if (user.isLoginDisabled) {
      throw new UnauthorizedException('Your account has been disabled by an administrator');
    }

    const isPasswordValid = await this.passwordService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials..!');

    const tokens = await this.tokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
    });

    return {
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        isLoginDisabled: user.isLoginDisabled,
        hideFeedbacks: user.hideFeedbacks,
        hideComments: user.hideComments,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User no longer exists');
    return this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
  }

  async logoutSession() {}

  async getMe(userId: string): Promise<Partial<User>> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
