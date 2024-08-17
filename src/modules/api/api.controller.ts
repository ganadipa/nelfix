import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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
}
