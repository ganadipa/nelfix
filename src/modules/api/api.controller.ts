import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { RegisterDto, SignInDto } from '../auth/dto';
import { TLoginPostData, TResponseStatus } from 'src/common/types';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FilmService } from '../film/film.service';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';

@Controller('api')
export class ApiController {
  constructor(
    private authService: AuthService,
    private filmService: FilmService,
  ) {}

  @Post('register')
  @Roles(['GUEST'])
  register(@Body() body: RegisterDto) {
    try {
      return {
        status: 'success',
        message: 'User registered successfully',
        data: this.authService.register(body),
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }

  @Post('login')
  @Roles(['GUEST'])
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response,
  ): Promise<TResponseStatus<TLoginPostData>> {
    const resp = await this.authService.signIn(body);

    if (resp.status === 'success') {
      res.cookie('token', resp.data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    }

    res.status(200).json(resp);
    return;
  }

  @Post('buy-film')
  @Roles(['USER', 'ADMIN'])
  async buyFilm(@Req() req: ExtendedRequest) {
    try {
      return {
        status: 'success',
        message: 'Film was successfully bought',
        data: await this.filmService.buyFilm(req.user.id, req.body.filmId),
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
