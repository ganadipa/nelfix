import { HttpException, Inject, Injectable, Query } from '@nestjs/common';
import { IUserRepository } from './repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getUsers(q: string) {
    const prismaUsers = await this.userRepository.getUsersLikeUsername(q);
    return prismaUsers.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
      };
    });
  }

  async getUser(id: string) {
    const prismaUser = await this.userRepository.findById(id);
    return {
      id: prismaUser.id,
      username: prismaUser.username,
      email: prismaUser.email,
      balance: prismaUser.balance,
    };
  }

  async addBalance(id: string, increment: number) {
    const prismaUser = await this.userRepository.findById(id);
    if (!prismaUser) {
      throw new Error('User not found!');
    }

    if (prismaUser.balance + increment < 0) {
      throw new Error('Balance cannot be negative!');
    }

    const updatedUser = await this.userRepository.update(id, {
      balance: prismaUser.balance + increment,
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      balance: updatedUser.balance,
    };
  }

  async deleteUser(id: string) {
    const prismaUser = await this.userRepository.findById(id);
    if (!prismaUser) {
      throw new Error('User not found!');
    }

    if (prismaUser.role === 'ADMIN') {
      throw new Error('Cannot delete an admin user!');
    }

    const deleted = await this.userRepository.delete(id);

    return {
      id: deleted.id,
      username: deleted.username,
      email: deleted.email,
      balance: deleted.balance,
    };
  }
}
