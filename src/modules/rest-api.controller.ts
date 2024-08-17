import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilmDto } from './film/dto/film.dto';
import { FilmService } from './film/film.service';
import {
  TFilmJson,
  TGetUser,
  TLoginPostData,
  TResponseStatus,
} from 'src/common/types';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { SignInDto } from './auth/dto';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';

@Controller('')
export class RestApiController {
  constructor(
    private filmService: FilmService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('films')
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
  ): Promise<TResponseStatus<TFilmJson | null>> {
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

  @Get('films')
  @Roles(['ADMIN'])
  async getFilms(
    @Query('q') q: string,
  ): Promise<TResponseStatus<Omit<TFilmJson, 'video_url'>[] | null>> {
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

  @Get('films/:id')
  @Roles(['ADMIN'])
  async getFilm(
    @Param('id') id: string,
  ): Promise<TResponseStatus<TFilmJson | null>> {
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

  @Put('films/:id')
  @Roles(['ADMIN'])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover_image', maxCount: 1 },
    ]),
  )
  async updateFilm(
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
    @Body() updateItemDto: FilmDto,
    @Param('id') id: string,
  ): Promise<TResponseStatus<TFilmJson | null>> {
    try {
      return {
        status: 'success',
        message: 'Film updated',
        data: await this.filmService.updateFilm(updateItemDto, files, id),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Delete('films/:id')
  @Roles(['ADMIN'])
  async deleteFilm(
    @Param('id') id: string,
  ): Promise<TResponseStatus<Omit<TFilmJson, 'cover_image_url'> | null>> {
    try {
      return {
        status: 'success',
        message: 'Film deleted',
        data: await this.filmService.deleteFilm(id),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Post('login')
  @Roles(['GUEST'])
  async signIn(
    @Body() body: SignInDto,
  ): Promise<TResponseStatus<TLoginPostData>> {
    return {
      status: 'success',
      message: 'User logged in successfully',
      data: await this.authService.signIn(body),
    };
  }

  @Get('self')
  @Roles(['USER', 'ADMIN'])
  async self(@Req() req: ExtendedRequest) {
    if (!req.user) {
      return {
        status: 'error',
        message: 'User not found',
        data: null,
      };
    }
    return {
      status: 'success',
      message: 'User found',
      data: {
        username: req.user.username,
        token: req.user.token,
      },
    };
  }

  @Get('users')
  @Roles(['ADMIN'])
  async getUsers(@Query('q') q: string): Promise<TResponseStatus<TGetUser[]>> {
    try {
      return {
        status: 'success',
        message: 'Users fetched successfully',
        data: await this.userService.getUsers(q),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Get('users/:id')
  @Roles(['ADMIN'])
  async getUser(@Param('id') id: string): Promise<TResponseStatus<TGetUser>> {
    try {
      return {
        status: 'success',
        message: 'User fetched successfully',
        data: await this.userService.getUser(id),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Post('users/:id/balance')
  @Roles(['ADMIN'])
  async addBalance(
    @Param('id') id: string,
    @Body('increment') inc: number,
  ): Promise<TResponseStatus<TGetUser>> {
    try {
      return {
        status: 'success',
        message: 'Balance updated successfully',
        data: await this.userService.addBalance(id, inc),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Delete('users/:id')
  @Roles(['ADMIN'])
  async deleteUser(
    @Param('id') id: string,
  ): Promise<TResponseStatus<TGetUser>> {
    try {
      return {
        status: 'success',
        message: 'User deleted successfully',
        data: await this.userService.deleteUser(id),
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
