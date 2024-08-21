import { TPrismaUser, TRole } from '../../../common/types';
export * from './db-user.repository';

export interface IUserRepository {
  create(
    filmData: Omit<TPrismaUser, 'id' | 'createdAt' | 'updatedAt' | 'role'> & {
      role?: TRole;
    },
  ): Promise<TPrismaUser>;
  findById(id: string): Promise<TPrismaUser | null>;
  findByUsername(username: string): Promise<TPrismaUser | null>;
  findByEmail(email: string): Promise<TPrismaUser | null>;
  update(id: string, filmData: Partial<TPrismaUser>): Promise<TPrismaUser>;
  delete(id: string): Promise<TPrismaUser>;
  getAll(): Promise<TPrismaUser[]>;
  getUsersLikeUsername(username: string): Promise<TPrismaUser[]>;
}
