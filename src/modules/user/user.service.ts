import { Injectable, Query } from '@nestjs/common';
import { UserRepository } from './repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(q: string) {
    const prismaUsers = await this.userRepository.getUsersLikeUsername(q);
    return {
      status: 'success',
      message: 'Users retrieved successfully!',
      data: prismaUsers.map((user) => {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
        };
      }),
    };
  }

  async getUser(id: string) {
    const prismaUser = await this.userRepository.findById(id);
    return {
      status: 'success',
      message: 'User retrieved successfully!',
      data: {
        id: prismaUser.id,
        username: prismaUser.username,
        email: prismaUser.email,
        balance: prismaUser.balance,
      },
    };
  }

  async addBalance(id: string, increment: number) {
    const prismaUser = await this.userRepository.findById(id);
    if (!prismaUser) {
      return {
        status: 'error',
        message: 'User not found!',
        data: null,
      };
    }

    if (prismaUser.balance + increment < 0) {
      return {
        status: 'error',
        message: 'Balance cannot be negative!',
        data: null,
      };
    }

    const updatedUser = await this.userRepository.update(id, {
      balance: prismaUser.balance + increment,
    });

    return {
      status: 'success',
      message: 'Balance updated successfully!',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        balance: updatedUser.balance,
      },
    };
  }

  async deleteUser(id: string) {
    const prismaUser = await this.userRepository.findById(id);
    if (!prismaUser) {
      return {
        status: 'error',
        message: 'User not found!',
      };
    }

    if (prismaUser.role === 'ADMIN') {
      return {
        status: 'error',
        message: 'Cannot delete an admin!',
        data: null,
      };
    }

    const deleted = await this.userRepository.delete(id);

    return {
      status: 'success',
      message: 'User deleted successfully!',
      data: {
        id: deleted.id,
        username: deleted.username,
        email: deleted.email,
        balance: deleted.balance,
      },
    };
  }
}
