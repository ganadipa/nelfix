import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { RegisterDto, SignInDto } from '../auth/dto';
import { TFilmJson, TLoginPostData, TResponseStatus } from 'src/common/types';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { BoughtFilmService } from '../bought-film/bought-film.service';
import { FilmService } from '../film/film.service';

@Controller('api')
export class ApiController {
  constructor(
    private authService: AuthService,
    private boughtFilmService: BoughtFilmService,
    private filmService: FilmService,
  ) {}

  @Post('register')
  @Roles(['GUEST'])
  async register(@Body() body: RegisterDto) {
    try {
      return {
        status: 'success',
        message: 'User registered successfully',
        data: await this.authService.register(body),
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
    @Res() res: Response,
  ): Promise<TResponseStatus<TLoginPostData>> {
    try {
      const resp = await this.authService.signIn(body);
      res.cookie('token', resp.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: resp,
      });
    } catch (e) {
      res.status(400).json({
        status: 'error',
        message: e.message,
        data: null,
      });
    }

    return;
  }

  @Post('buy-film')
  @Roles(['USER', 'ADMIN'])
  async buyFilm(@Req() req: ExtendedRequest) {
    try {
      return {
        status: 'success',
        message: 'Film was successfully bought',
        data: await this.boughtFilmService.buyFilm(
          req.user.id,
          req.body.filmId,
        ),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
        data: null,
      };
    }
  }

  @Get('logout')
  @Roles(['USER', 'ADMIN'])
  async logout(@Res() res: Response, @Req() req: ExtendedRequest) {
    res.clearCookie('token');
    res.status(200).json({
      status: 'success',
      message: 'User logged out successfully',
      data: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        token: req.user.token,
      },
    });
  }

  @Get('search-films')
  @Roles(['ADMIN', 'USER', 'GUEST'])
  async getFilms(
    @Query('q') q?: string,
    @Query('page') pageStr: string = '1',
  ): Promise<
    TResponseStatus<{
      films: Omit<TFilmJson, 'video_url'>[];
      total: number;
    }>
  > {
    const page = parseInt(pageStr, 10);

    const films = await this.filmService.getFilms(q);
    const filmsWithoutVideoUrl = films.map((film) => {
      const { video_url, ...rest } = film;
      return rest;
    });

    const numberOfFilmsPerPage = 12;
    const paginatedFilms = filmsWithoutVideoUrl.slice(
      (page - 1) * numberOfFilmsPerPage,
      page * numberOfFilmsPerPage,
    );

    try {
      return {
        status: 'success',
        message: 'Films retrieved',
        data: {
          films: paginatedFilms,
          total: filmsWithoutVideoUrl.length,
        },
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
