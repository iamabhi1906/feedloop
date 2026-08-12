import { Controller, Get, Query } from '@nestjs/common';
import { CheckUserNameDTO } from './dto/check-username.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
    }));
  }

  @Get('check-username')
  async checkUsername(@Query() { username }: CheckUserNameDTO) {
    const isAvailable = !(await this.usersService.validateUserName(username));
    return { isAvailable };
  }
}
