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
  postFilms(@Query('q') q: string) {
    return this.filmService.getFilms(q);
  }

  @Post('')
  @Roles(['ADMIN'])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover_image', maxCount: 1 },
    ]),
  )
  createFilm(
    @UploadedFiles()
    files: {
      video: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
    @Body() createItemDto: FilmDto,
  ) {
    return this.filmService.createFilm(createItemDto, files);
  }

  @Get(':id')
  @Roles(['ADMIN'])
  getFilm(@Param('id') id: string) {
    return this.filmService.getFilm(id);
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
    return this.filmService.updateFilm(updateItemDto, files, id);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  deleteFilm(@Param('id') id: string) {
    return this.filmService.deleteFilm(id);
  }
}
