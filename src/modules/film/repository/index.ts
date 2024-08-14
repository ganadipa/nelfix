import { TPrismaFilm } from '../../../common/types';
export * from './film.repository';

export interface IFilmRepository {
  create(
    filmData: Omit<TPrismaFilm, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TPrismaFilm>;
  findById(id: string): Promise<TPrismaFilm | null>;
  update(id: string, filmData: Partial<TPrismaFilm>): Promise<TPrismaFilm>;
  delete(id: string): Promise<TPrismaFilm>;
  getAll(): Promise<TPrismaFilm[]>;
  getFilmsLikeTitle(title: string): Promise<TPrismaFilm[]>;
  getFilmsLikeDirector(director: string): Promise<TPrismaFilm[]>;
}
