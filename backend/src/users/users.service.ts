import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordService } from '../auth/password/password.service';
import { SignupDTO } from '../auth/dto/signup.dto';

import { AdminUsersQueryDTO } from './dto/admin-users-query.dto';
import { UpdateUserActionsDTO } from './dto/update-user-actions.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUserName(username: string): Promise<boolean> {
    return await this.userRepository.exists({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: id });
  }

  async create(user: SignupDTO): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });
    if (existing) {
      if (existing.email === user.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existing.username === user.username) {
        throw new ConflictException('User with this username already exists');
      }
    }
    const hashPassword = await this.passwordService.hash(user.password);
    const newUser = this.userRepository.create({
      ...user,
      password: hashPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getAdminUsers(query: AdminUsersQueryDTO) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const qb = this.userRepository.createQueryBuilder('user');

    if (query.search) {
      qb.where(
        '(user.name ILIKE :search OR user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, total] = await qb.getManyAndCount();

    const data = users.map((u) => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserActions(userId: string, dto: UpdateUserActionsDTO) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id:${userId} not found`);
    }

    if (dto.isLoginDisabled !== undefined) {
      user.isLoginDisabled = dto.isLoginDisabled;
    }
    if (dto.hideFeedbacks !== undefined) {
      user.hideFeedbacks = dto.hideFeedbacks;
    }
    if (dto.hideComments !== undefined) {
      user.hideComments = dto.hideComments;
    }

    const updatedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with id:${id} not found`);
    return this.userRepository.remove(user);
  }
}
