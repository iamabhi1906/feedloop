import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private static readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, PasswordService.SALT_ROUNDS);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    console.log(plainPassword, hashedPassword);
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
