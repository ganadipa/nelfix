import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoughtFilmSeeder } from './bought-film.seeder';
import { FilmSeeder } from './film.seeder';
import { UserSeeder } from './user.seeder';
import { SeederFactory } from './seeder.factory';
import { ConfigService } from '@nestjs/config';
import { FirebaseModule } from '../firebase/firebase.module';
import { FileModule } from '../file/file.module';
import { BoughtFilmModule } from '../bought-film/bought-film.module';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    FirebaseModule,
    FileModule,
    BoughtFilmModule,
    FilmModule,
    UserModule,
  ],
  providers: [
    PrismaService,
    UserSeeder,
    FilmSeeder,
    BoughtFilmSeeder,
    SeederFactory,
    ConfigService,
  ],
  exports: [SeederFactory],
})
export class SeederModule {}
