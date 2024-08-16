import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import { UserRepository } from '../user/repository';
import { TPrismaUser, TRole, TUser } from 'src/common/types';
import * as argon from 'argon2';

@Injectable()
export class UserSeeder extends Seeder<{ id: string; username: string }> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async seed(): Promise<void> {
    const users = [
      {
        username: 'johndoe',
        email: 'johndoe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        hashedPassword: await argon.hash('password1'),
        balance: 500,
        role: 'USER',
      },
      {
        username: 'janedoe',
        email: 'janedoe@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        hashedPassword: await argon.hash('password2'),
        balance: 1000,
        role: 'USER',
      },
      {
        username: 'adminuser',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        hashedPassword: await argon.hash('password3'),
        balance: 1500,
        role: 'ADMIN',
      },
    ];

    for (const userData of users) {
      const user = await this.userRepository.create(
        userData as Omit<
          TPrismaUser,
          'id' | 'createdAt' | 'updatedAt' | 'role'
        > & {
          role?: TRole;
        },
      );
      this.logSeeding('User', {
        id: user.id,
        username: user.username,
      });
    }
  }
}
