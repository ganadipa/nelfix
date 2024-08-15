import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { FilmService } from '../film/film.service';
import { FilmModule } from '../film/film.module';

@Module({
  imports: [AuthModule, FilmModule],
  controllers: [ApiController],
  providers: [AuthService, JwtService],
})
export class ApiModule {}
