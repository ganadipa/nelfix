import { TPrismaReviewFilm } from 'src/common/types';

export interface IFilmReviewRepository {
  create(reviewInfo: {
    userId: string;
    filmId: string;
    rating: number;
  }): Promise<TPrismaReviewFilm>;
  findById(id: string): Promise<TPrismaReviewFilm | null>;
  delete(id: string): Promise<TPrismaReviewFilm>;
  getAll(): Promise<TPrismaReviewFilm[]>;
  getReviewsByUserId(userId: string): Promise<TPrismaReviewFilm[]>;
  getReviewsByFilmId(filmId: string): Promise<TPrismaReviewFilm[]>;
  getReviewByUserIdAndFilmId(
    userId: string,
    filmId: string,
  ): Promise<TPrismaReviewFilm | null>;
  getFilmsSortedByRating({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ filmId: string; rating: number; count: number }[]>;
}
