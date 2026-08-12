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

  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with id:${id} not found`);
    return this.userRepository.remove(user);
  }
}
