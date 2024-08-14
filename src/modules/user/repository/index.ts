import { TPrismaUser } from '../../../common/types';
export * from './user.repository';

export interface IUserRepository {
  create(filmData: TPrismaUser): Promise<TPrismaUser>;
  findById(id: string): Promise<TPrismaUser | null>;
  findByUsername(username: string): Promise<TPrismaUser | null>;
  findByEmail(email: string): Promise<TPrismaUser | null>;
  update(id: string, filmData: Partial<TPrismaUser>): Promise<TPrismaUser>;
  delete(id: string): Promise<TPrismaUser>;
  getAll(): Promise<TPrismaUser[]>;
  getUsersLikeUsername(username: string): Promise<TPrismaUser[]>;
}
