import { Inject, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { IUserRepository } from '../user/repository';
import { IFilmReviewRepository } from './repository';

@Injectable()
export class FilmReviewService {
  constructor(
    @Inject('FilmReviewRepository')
    private readonly filmReviewRepository: IFilmReviewRepository,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createReview(reviewInfo: {
    userId: string;
    filmId: string;
    rating: number;
  }) {
    return this.filmReviewRepository.create(reviewInfo);
  }

  async getReviewById(id: string) {
    return this.filmReviewRepository.findById(id);
  }

  async deleteReview(id: string) {
    return this.filmReviewRepository.delete(id);
  }

  async getAllReviews() {
    return this.filmReviewRepository.getAll();
  }

  async getReviewsByUserId(userId: string) {
    return this.filmReviewRepository.getReviewsByUserId(userId);
  }

  async getReviewsByFilmId(filmId: string) {
    return this.filmReviewRepository.getReviewsByFilmId(filmId);
  }

  async getReviewsAlongsideWithUser(filmId: string) {
    const reviews = await this.filmReviewRepository.getReviewsByFilmId(filmId);
    const users = await this.userRepository.getAll();

    return reviews.map((review) => {
      const user = users.find((user) => user.id === review.userId);
      const userJson = user ? new User(user).toJSON() : null;
      return {
        ...review,
        user: user ? user : null,
      };
    });
  }

  async getAverageRatingAndTotalVoters(filmId: string) {
    const reviews = await this.getReviewsByFilmId(filmId);
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        avg: 0,
        total: 0,
      };
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      avg: totalRating / totalReviews,
      total: totalReviews,
    };
  }

  async hadRatedFilm(
    userId: string,
    filmId: string,
  ): Promise<number | undefined> {
    const review = await this.filmReviewRepository.getReviewByUserIdAndFilmId(
      userId,
      filmId,
    );

    return review ? review.rating : undefined;
  }

  async getTopFilms(interval: { startDate?: Date; endDate?: Date }) {
    return this.filmReviewRepository.getFilmsSortedByRating(interval);
  }

  async getTopFilmsThisMonth() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonth = now.getMonth() + 1 === 12 ? 1 : now.getMonth() + 1;
    const endYear =
      now.getMonth() + 1 === 12 ? now.getFullYear() + 1 : now.getFullYear();
    const end = new Date(endYear, endMonth, 0);

    return this.getTopFilms({ startDate: start, endDate: end });
  }
}
