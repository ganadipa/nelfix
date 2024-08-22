import { Inject, Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import { IBoughtFilmRepository } from '../bought-film/repository';
import { IUserRepository } from '../user/repository';
import { IFilmReviewRepository } from '../film-review/repository';

@Injectable()
export class FilmReviewSeeder extends Seeder<{
  filmId: string;
  userId: string;
}> {
  constructor(
    @Inject('BoughtFilmRepository')
    private readonly boughtFilmRepository: IBoughtFilmRepository,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('FilmReviewRepository')
    private readonly filmReviewRepository: IFilmReviewRepository,
  ) {
    super();
  }

  async seed(): Promise<void> {
    const allUsers = await this.userRepository.getAll();
    const userIds = allUsers.map((user) => user.id);
    const allBoughtFilms = await this.boughtFilmRepository.getAll();

    let reviewBoughtFilms: {
      filmId: string;
      userId: string;
      rating: number;
    }[] = [];

    userIds.map((userId) => {
      const userBoughtFilms = allBoughtFilms.filter(
        (boughtFilm) => boughtFilm.userId === userId,
      );

      userBoughtFilms.map((boughtFilm) => {
        // For each user, choose if they want to review their bought films or not
        const review = Math.random() < 0.5;
        if (review) {
          reviewBoughtFilms.push({
            filmId: boughtFilm.filmId,
            userId,
            rating: Math.floor(Math.random() * 10) + 1,
          });
        }
      });
    });

    for (const eachUserReviewBoughtFilms of reviewBoughtFilms) {
      await this.filmReviewRepository.create(eachUserReviewBoughtFilms);
    }
  }
}
