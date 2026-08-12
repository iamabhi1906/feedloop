import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import User from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../users/enums/user-role.enum';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);
    const password = await bcrypt.hash('12345678', 10);

    const users = [
      {
        name: 'Admin',
        password,
        role: UserRole.ADMIN,
        email: 'admin@gmail.com',
        username: 'admin',
        isLoginDisabled: false,
      },
    ];
    await repository.upsert(users, ['email']);
  }
}
