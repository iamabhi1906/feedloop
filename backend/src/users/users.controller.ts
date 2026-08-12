import { Controller, Get, Query } from '@nestjs/common';
import { CheckUserNameDTO } from './dto/check-username.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('check-username')
  async checkUsername(@Query() { username }: CheckUserNameDTO) {
    const isAvailable = !(await this.usersService.validateUserName(username));
    return { isAvailable };
  }
}
