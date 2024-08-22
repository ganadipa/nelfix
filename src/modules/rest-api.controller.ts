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
import { RestApiSignInDto, SignInDto } from './auth/dto';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { BoughtFilmService } from './bought-film/bought-film.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('rest-api')
@Controller('')
export class RestApiController {
  constructor(
    private filmService: FilmService,
    private authService: AuthService,
    private userService: UserService,
    private boughtFilmService: BoughtFilmService,
  ) {}
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new film. Allowed roles: Admin only.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Film DTO',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Inception' },
        description: { type: 'string', example: 'A mind-bending thriller' },
        director: { type: 'string', example: 'Christopher Nolan' },
        release_year: { type: 'integer', example: 2010 },
        genre: {
          type: 'array',
          items: { type: 'string' },
          example: ['Sci-Fi', 'Thriller'],
        },
        price: { type: 'number', format: 'float', example: 19.99 },
        duration: {
          type: 'integer',
          description: 'Duration in seconds',
          example: 8820,
        },
        video: {
          type: 'string',
          format: 'binary',
          description: 'The binary video file',
        },
        cover_image: {
          type: 'string',
          format: 'binary',
          description: 'The binary image file, optional',
          nullable: true,
        },
      },
      required: [
        'title',
        'description',
        'director',
        'release_year',
        'genre',
        'price',
        'duration',
        'video',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The film has been successfully created.',
    schema: {
      example: {
        status: 'success',
        message: 'Film created',
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
        message: 'Password is too short',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
        data: null,
      },
    },
  })
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all films. Allowed roles: Admin only.' })
  @ApiResponse({
    status: 200,
    description: 'The films have been successfully retrieved.',
    schema: {
      example: {
        status: 'success',
        message: 'Films retrieved',
        data: [
          {
            id: '123',
            title: 'Inception',
            description: 'A mind-bending thriller',
            release_year: 2010,
            director: 'Christopher Nolan',
            genre: ['Action', 'Sci-Fi'],
            price: 100,
            duration: 3600,
            cover_image_url: 'http://example.com/cover.jpg',
            created_at: '2021-09-01T00:00:00.000Z',
            updated_at: '2021-09-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Optional search query to filter films',
  })
  @Get('films')
  @Roles(['ADMIN'])
  async getFilms(
    @Query('q') q?: string,
  ): Promise<TResponseStatus<Omit<TFilmJson, 'video_url' | 'description'>[]>> {
    const films = await this.filmService.getFilms(q);
    const filmsWithoutVideoUrlAndDescription = films.map((film) => {
      const { video_url, description, ...rest } = film;
      return rest;
    });

    try {
      return {
        status: 'success',
        message: 'Films retrieved',
        data: filmsWithoutVideoUrlAndDescription,
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
  @ApiOperation({ summary: 'Get a film by ID. Allowed roles: Admin only.' })
  @ApiResponse({
    status: 200,
    description: 'Film retrieved.',
    schema: {
      example: {
        status: 'success',
        message: 'Film retrieved',
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
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
        data: null,
      },
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the film',
  })
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a film by ID. Allowed roles: Admin only.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Film DTO',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Inception' },
        description: { type: 'string', example: 'A mind-bending thriller' },
        director: { type: 'string', example: 'Christopher Nolan' },
        release_year: { type: 'integer', example: 2010 },
        genre: {
          type: 'array',
          items: { type: 'string' },
          example: ['Sci-Fi', 'Thriller'],
        },
        price: { type: 'number', format: 'float', example: 19.99 },
        duration: {
          type: 'integer',
          description: 'Duration in seconds',
          example: 8820,
        },
        video: {
          type: 'string',
          format: 'binary',
          description: 'The binary video file, optional',
        },
        cover_image: {
          type: 'string',
          format: 'binary',
          description: 'The binary image file, optional',
        },
      },
      required: [
        'title',
        'description',
        'director',
        'release_year',
        'genre',
        'price',
        'duration',
      ],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The film has been successfully updated.',
    schema: {
      example: {
        status: 'success',
        message: 'Film updated',
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
        message: 'Film not found',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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
    console.log(files);
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a film by ID. Allowed roles: Admin only.' })
  @ApiResponse({
    status: 200,
    description: 'The film has been successfully deleted.',
    schema: {
      example: {
        status: 'success',
        message: 'Film deleted',
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
        message: 'Film not found',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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
  @Delete('films/:id')
  @Roles(['ADMIN'])
  async deleteFilm(
    @Param('id') id: string,
  ): Promise<
    TResponseStatus<Omit<
      TFilmJson,
      'cover_image_url' | 'price' | 'duration'
    > | null>
  > {
    try {
      const filmsWithoutCoverImageUrl =
        await this.boughtFilmService.deleteFilm(id);
      const { price, duration, ...rest } = filmsWithoutCoverImageUrl;

      return {
        status: 'success',
        message: 'Film deleted',
        data: rest,
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
  @ApiOperation({ summary: 'Login using username and password' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Sign in DTO',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'password' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User logged in successfully',
        data: {
          username: 'john_doe',
          token: '<a token>',
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
  @Post('login')
  @Roles(['GUEST', 'USER', 'ADMIN'])
  async signIn(
    @Body() body: RestApiSignInDto,
  ): Promise<TResponseStatus<TLoginPostData>> {
    return {
      status: 'success',
      message: 'User logged in successfully',
      data: await this.authService.signInUsingUsername(body),
    };
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      example: {
        status: 'success',
        message: 'User found',
        data: {
          username: 'john_doe',
          token: '<a token>',
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
        message: 'User not found',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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
  @Get('self')
  @Roles(['ADMIN'])
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all the registered users' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Optional search query to filter users',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Users fetched successfully',
        data: [
          {
            id: '123',
            username: 'john_doe',
            email: 'johndoe@example.com',
            balance: 100,
          },
          {
            id: '124',
            username: 'jane_doe',
            email: 'janedoe@example.com',
            balance: 200,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User fetched successfully',
        data: {
          id: '123',
          username: 'john_doe',
          email: 'johndoe@example.com',
          balance: 100,
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
        message: 'User not found',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add balance to a user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add balance Object: { increment: number }',
    schema: {
      type: 'object',
      properties: {
        increment: { type: 'number', example: 100 },
      },
      required: ['increment'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Balance updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Balance updated successfully',
        data: {
          id: '123',
          username: 'john_doe',
          email: 'johndoe@example.com',
          balance: 200,
        },
      },
    },
  })
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

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a user by ID. Allowed roles: Admin only.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'User deleted successfully',
        data: {
          id: '123',
          username: 'john_doe',
          email: 'johndoe@example.com',
          balance: 200,
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
        message: 'User not found',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
    schema: {
      example: {
        status: 'error',
        message: 'Forbidden resource',
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
