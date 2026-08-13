import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CheckUserNameDTO } from './dto/check-username.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminUsersQueryDTO } from './dto/admin-users-query.dto';
import { UpdateUserActionsDTO } from './dto/update-user-actions.dto';

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

  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAdminUsers(@Query() query: AdminUsersQueryDTO) {
    return await this.usersService.getAdminUsers(query);
  }

  @Get('check-username')
  async checkUsername(@Query() { username }: CheckUserNameDTO) {
    const isAvailable = !(await this.usersService.validateUserName(username));
    return { isAvailable };
  }

  @Patch(':id/actions')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateUserActions(
    @Param('id') id: string,
    @Body() dto: UpdateUserActionsDTO,
  ) {
    return await this.usersService.updateUserActions(id, dto);
  }
}

