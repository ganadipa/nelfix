import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignInDto } from './auth/dto';
import { AuthService } from './auth/auth.service';
import { TLoginPostData, TResponseStatus } from '../common/types';
import { AuthGuard } from './auth/auth.guard';
import { Request } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';

@UseGuards(AuthGuard)
@Controller('')
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Roles(['GUEST'])
  async signIn(
    @Body() body: SignInDto,
    @Req() req: Request,
  ): Promise<TResponseStatus<TLoginPostData>> {
    const resp = await this.authService.signIn(body);
    return resp;
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
}
