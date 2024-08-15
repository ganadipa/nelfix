import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilmDto } from './dto/film.dto';
import { FilmService } from './film.service';

@Controller('films')
export class FilmController {
  constructor(private filmService: FilmService) {}

  @Get('')
  @Roles(['ADMIN'])
  async postFilms(@Query('q') q: string) {
    try {
      return {
        status: 'success',
        message: 'Films retrieved',
        data: await this.filmService.getFilms(q),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Post('')
  @Roles(['ADMIN'])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover_image', maxCount: 1 },
    ]),
  )
  async createFilm(
    @UploadedFiles()
    files: {
      video: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
    @Body() createItemDto: FilmDto,
  ) {
    try {
      return {
        status: 'success',
        message: 'Film created',
        data: await this.filmService.createFilm(createItemDto, files),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Get(':id')
  @Roles(['ADMIN'])
  async getFilm(@Param('id') id: string) {
    try {
      return {
        status: 'success',
        message: 'Film retrieved',
        data: await this.filmService.getFilm(id),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Put(':id')
  @Roles(['ADMIN'])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover_image', maxCount: 1 },
    ]),
  )
  updateFilm(
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
    @Body() updateItemDto: FilmDto,
    @Param('id') id: string,
  ) {
    try {
      return {
        status: 'success',
        message: 'Film updated',
        data: this.filmService.updateFilm(updateItemDto, files, id),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  deleteFilm(@Param('id') id: string) {
    try {
      return {
        status: 'success',
        message: 'Film deleted',
        data: this.filmService.deleteFilm(id),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }
}
