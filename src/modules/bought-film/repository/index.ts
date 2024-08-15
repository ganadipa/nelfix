import { TPrismaBoughtFilm } from 'src/common/types';

export * from './bought-film.repository';

export interface IBoughtFilmRepository {
  create(boughtInfo: {
    userId: string;
    filmId: string;
  }): Promise<TPrismaBoughtFilm>;
  findById(id: string): Promise<TPrismaBoughtFilm | null>;
  delete(id: string): Promise<TPrismaBoughtFilm>;
  getAll(): Promise<TPrismaBoughtFilm[]>;
  getBoughtFilmsByUserId(userId: string): Promise<TPrismaBoughtFilm[]>;
  getBoughtFilmsByFilmId(filmId: string): Promise<TPrismaBoughtFilm[]>;
  getBoughtFilmByUserIdAndFilmId(
    userId: string,
    filmId: string,
  ): Promise<TPrismaBoughtFilm | null>;
}
