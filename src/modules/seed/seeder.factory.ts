import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository';
import { BoughtFilmSeeder } from './bought-film.seeder';
import { FilmSeeder } from './film.seeder';
import { ISeeder } from './seeder.interface';
import { UserSeeder } from './user.seeder';

@Injectable()
export class SeederFactory {
  constructor(
    private userSeeder: UserSeeder,
    private filmSeeder: FilmSeeder,
    private boughtFilmSeeder: BoughtFilmSeeder,
  ) {}

  createSeeder(type: string): ISeeder<Object> {
    switch (type) {
      case 'User':
        return this.userSeeder;
      case 'Film':
        return this.filmSeeder;
      case 'BoughtFilm':
        return this.boughtFilmSeeder;
      default:
        throw new Error('Unknown seeder type');
    }
  }

  async run(): Promise<void> {
    await this.userSeeder.seed();
    await this.filmSeeder.seed();
    await this.boughtFilmSeeder.seed();
  }
}
