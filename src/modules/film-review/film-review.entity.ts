import { TPrismaReviewFilm, TReviewJson } from 'src/common/types';

export class FilmReview {
  id: string;
  createdAt: Date;
  userId: string;
  filmId: string;
  rating: number;

  constructor(filmData: TPrismaReviewFilm) {
    Object.assign(this, filmData);
  }

  public toJSON(): TReviewJson {
    return {
      id: this.id,
      created_at: this.createdAt,
      user_id: this.userId,
      film_id: this.filmId,
      rating: this.rating,
    };
  }
}
