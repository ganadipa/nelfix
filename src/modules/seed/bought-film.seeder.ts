import { Inject, Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import { IBoughtFilmRepository } from '../bought-film/repository';
import { IFilmRepository } from '../film/repository';
import { IUserRepository } from '../user/repository';

@Injectable()
export class BoughtFilmSeeder extends Seeder<{
  filmId: string;
  userId: string;
}> {
  constructor(
    @Inject('BoughtFilmRepository')
    private readonly boughtFilmRepository: IBoughtFilmRepository,
    @Inject('FilmRepository')
    private readonly filmRepository: IFilmRepository,
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  async seed(): Promise<void> {
    const allFilms = await this.filmRepository.getAll();
    const filmIds = allFilms.map((film) => film.id);
    const allUsers = await this.userRepository.getAll();
    const userIds = allUsers.map((user) => user.id);

    // for each user set how many films they bought then randomly select that number of films
    const boughtFilms = userIds.map((userId) => {
      const boughtFilmCount = Math.floor(Math.random() * filmIds.length);
      const boughtFilmIds = filmIds
        .sort(() => Math.random() - 0.5)
        .slice(0, boughtFilmCount);
      return boughtFilmIds.map((filmId) => ({
        filmId,
        userId,
      }));
    });

    for (const eachUserBoughtFilms of boughtFilms) {
      for (const boughtFilm of eachUserBoughtFilms) {
        await this.boughtFilmRepository.create(boughtFilm);
      }
    }
  }
}
