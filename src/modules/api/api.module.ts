import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthModule } from '../auth/auth.module';
import { BoughtFilmModule } from '../bought-film/bought-film.module';

@Module({
  imports: [AuthModule, BoughtFilmModule],
  controllers: [ApiController],
  providers: [],
  exports: [AuthModule],
})
export class ApiModule {}
