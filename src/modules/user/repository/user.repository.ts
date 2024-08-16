import { TPrismaUser, TRole } from 'src/common/types';
import { IUserRepository } from '.';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../modules/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    userData: Omit<TPrismaUser, 'id' | 'createdAt' | 'updatedAt' | 'role'> & {
      role?: TRole;
    },
  ): Promise<TPrismaUser> {
    return this.prisma.user.create({
      data: {
        ...userData,
        role: userData.role || 'USER',
      },
    });
  }
  findById(id: string): Promise<TPrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByUsername(username: string): Promise<TPrismaUser> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findByEmail(email: string): Promise<TPrismaUser> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  update(id: string, userData: Partial<TPrismaUser>): Promise<TPrismaUser> {
    return this.prisma.user.update({ where: { id }, data: userData });
  }
  delete(id: string): Promise<TPrismaUser> {
    return this.prisma.user.delete({ where: { id } });
  }
  getAll(): Promise<TPrismaUser[]> {
    return this.prisma.user.findMany();
  }
  getUsersLikeUsername(username: string): Promise<TPrismaUser[]> {
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: 'insensitive',
        },
        role: 'USER',
      },
    });
  }
}
