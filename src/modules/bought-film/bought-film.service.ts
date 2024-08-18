import { HttpException, Injectable } from '@nestjs/common';
import { BoughtFilmRepository } from './repository';
import { FilmRepository } from '../film/repository';
import { TFilmJson, TPrismaFilm } from 'src/common/types';
import { Film } from '../film/film.entity';
import { UserService } from '../user/user.service';
import { FilmService } from '../film/film.service';

@Injectable()
export class BoughtFilmService {
  constructor(
    private readonly boughtFilmRepository: BoughtFilmRepository,
    private readonly filmRepository: FilmRepository,
    private readonly userService: UserService,
    private readonly filmService: FilmService,
  ) {}

  async getFilmsRelative(
    userId?: string,
  ): Promise<(TFilmJson & { is_bought: boolean })[]> {
    const films = await this.filmRepository.getAll();
    if (!userId) {
      return films.map((film) => {
        const filmJson = new Film(film).toJSON();
        return { ...filmJson, is_bought: false };
      });
    }

    const boughtFilms =
      await this.boughtFilmRepository.getBoughtFilmsByUserId(userId);

    const boughtMap = new Map<string, boolean>();
    boughtFilms.forEach((film) => boughtMap.set(film.filmId, true));

    const returnedFilms = films.map((film) => {
      const filmJson = new Film(film).toJSON();
      return {
        ...filmJson,
        is_bought: boughtMap.has(filmJson.id),
      };
    });

    // OK
    return returnedFilms;
  }

  async hadBought(userId: string, filmId: string) {
    const boughtFilm =
      await this.boughtFilmRepository.getBoughtFilmByUserIdAndFilmId(
        userId,
        filmId,
      );
    if (!boughtFilm) {
      return false;
    }

    const film = await this.filmRepository.findById(filmId);
    if (!film) {
      throw new Error('Film not found!');
    }

    // OK
    return true;
  }

  async getBoughtFilmsByUserId(userId: string) {
    const boughtFilms =
      await this.boughtFilmRepository.getBoughtFilmsByUserId(userId);
    const films = await this.filmRepository.getAll();

    const boughtMap = new Map<string, boolean>();
    boughtFilms.forEach((film) => boughtMap.set(film.filmId, true));

    const returnedFilms = films
      .filter((film) => boughtMap.has(film.id))
      .map((film) => new Film(film).toJSON());

    // OK
    return returnedFilms;
  }

  async buyFilm(userId: string, filmId: string) {
    // Check if the user has already bought the film
    const boughtFilm =
      await this.boughtFilmRepository.getBoughtFilmByUserIdAndFilmId(
        userId,
        filmId,
      );
    if (boughtFilm) {
      throw new Error('Film already bought!');
    }

    const user = await this.userService.getUser(userId);
    const film = await this.filmRepository.findById(filmId);

    if (user.balance < film.price) {
      throw new Error('Insufficient balance!');
    }

    // Update the user's balance
    await this.userService.addBalance(userId, -film.price);

    // Create a new bought film record
    await this.boughtFilmRepository.create({ userId, filmId });

    const filmJson = new Film(film).toJSON();

    // OK
    return { ...filmJson, is_bought: true };
  }

  sortFilmsByIsBoughtThenReleaseYear(
    films: (TFilmJson & { is_bought: boolean })[],
  ) {
    const copy = [...films];
    copy.sort((a, b) => {
      if (a.is_bought === b.is_bought) {
        return b.release_year - a.release_year;
      }
      return a.is_bought ? -1 : 1;
    });

    return copy;
  }

  async queryFilmsRelative(
    userId?: string,
    q?: string,
  ): Promise<(TFilmJson & { is_bought: boolean })[]> {
    const films = await this.filmService.getFilms(q);

    // if no user is logged in, return the films
    if (!userId) {
      return films.map((film) => ({
        ...film,
        is_bought: false,
      }));
    }

    // Get the bought films
    const boughtFilms =
      await this.boughtFilmRepository.getBoughtFilmsByUserId(userId);
    const boughtMap = new Map<string, boolean>();
    boughtFilms.forEach((film) => boughtMap.set(film.filmId, true));

    // Prepare for return
    const returnedFilms = films.map((film) => {
      return {
        ...film,
        is_bought: boughtMap.has(film.id),
      };
    });

    // OK
    return returnedFilms;
  }
}
