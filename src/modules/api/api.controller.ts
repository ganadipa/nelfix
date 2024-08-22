import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { CreateReviewDto } from '../film-review/dto/film-review.dto';
import { FilmReviewService } from '../film-review/film-review.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BuyFilmDto } from '../bought-film/dto/buy-film.dto';

@ApiTags('Internal API')
@Controller('api')
export class ApiController {
  constructor(
    private authService: AuthService,
    private boughtFilmService: BoughtFilmService,
    private reviewFilmService: FilmReviewService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new user. Allowed roles: Guest only.' })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Register data',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        status: 'success',
        message: 'User created successfully',
        data: {
          id: '1',
          username: 'test',
          email: 'example@example.com',
          token: '<some_jwt_token>',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        status: 'error',
        message:
          'Please change your username as that identifier is already in use',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource.',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        status: 'error',
        message: 'Internal server error',
        data: null,
      },
    },
  })
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sign in. Allowed roles: Guest only.' })
  @ApiBody({
    description: 'Sign in data',
    type: SignInDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    schema: {
      example: {
        status: 'success',
        message: 'User logged in successfully',
        data: {
          id: '1',
          username: 'test',
          email: 'test@example.com',
          token: '<some_jwt_token>',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource.',
        data: null,
      },
    },
  })
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
      res.send({
        status: 'error',
        message: e.message,
        data: null,
      });
    }

    return {
      status: 'error',
      message: 'Somehow went here',
      data: null,
    };
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buy a film. Allowed roles: User and Admin.' })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Buy film data',
    type: BuyFilmDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The film has been successfully bought.',
    schema: {
      example: {
        status: 'success',
        message: 'Film was successfully bought',
        data: {
          id: '123',
          title: 'Inception',
          description: 'A mind-bending thriller',
          release_year: 2010,
          director: 'Christopher Nolan',
          genre: ['Action', 'Sci-Fi'],
          price: 100,
          duration: 3600,
          video_url: 'http://example.com/video.mp4',
          cover_image_url: 'http://example.com/cover.jpg',
          created_at: '2021-09-01T00:00:00.000Z',
          updated_at: '2021-09-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        status: 'error',
        message: 'Balance is not enough',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource.',
        data: null,
      },
    },
  })
  @Post('buy-film')
  @Roles(['USER', 'ADMIN'])
  async buyFilm(@Req() req: ExtendedRequest, @Body() body: BuyFilmDto) {
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout. Allowed roles: User and Admin.' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged out.',
    schema: {
      example: {
        status: 'success',
        message: 'User logged out successfully',
        data: {
          id: '1',
          email: 'example@example.com',
          username: 'test',
          token: '<some_jwt_token>',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource.',
        data: null,
      },
    },
  })
  @Post('logout')
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reviews a film. Allowed roles: User and Admin.' })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Film ID',
    type: CreateReviewDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Review was successfully added',
    schema: {
      example: {
        status: 'success',
        message: 'Review was successfully added',
        data: {
          userId: '1',
          filmId: '1',
          rating: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        status: 'error',
        message: 'You have not bought this film',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
        data: null,
      },
    },
  })
  @Post('review')
  @Roles(['USER', 'ADMIN'])
  async reviewFilm(
    @Req() req: ExtendedRequest,
    @Body() review: CreateReviewDto,
  ) {
    const boughtFilm = req.user
      ? await this.boughtFilmService.hadBought(req.user.id, review.filmId)
      : false;
    if (!boughtFilm) {
      throw new BadRequestException('You have not bought this film');
    }

    try {
      return {
        status: 'success',
        message: 'Review was successfully added',
        data: await this.reviewFilmService.createReview({
          userId: req.user.id,
          filmId: review.filmId,
          rating: review.rating,
        }),
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
