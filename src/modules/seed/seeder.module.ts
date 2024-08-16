import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoughtFilmSeeder } from './bought-film.seeder';
import { FilmSeeder } from './film.seeder';
import { UserSeeder } from './user.seeder';
import { SeederFactory } from './seeder.factory';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../user/repository';
import { FilmRepository } from '../film/repository';
import { BoughtFilmRepository } from '../bought-film/repository';
import { FirebaseRepository } from '../firebase/firebase.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [FirebaseModule],
  providers: [
    PrismaService,
    UserSeeder,
    FilmSeeder,
    BoughtFilmSeeder,
    SeederFactory,
    ConfigService,
    UserRepository,
    FilmRepository,
    BoughtFilmRepository,
    FileService,
  ],
  exports: [SeederFactory],
})
export class SeederModule {}
