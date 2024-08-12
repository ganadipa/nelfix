import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInDto } from './auth/dto';
import { AuthService } from './auth/auth.service';
import { TLoginPostData, TResponseStatus } from './types';
import { ConfigService } from '@nestjs/config';

@Controller('')
export class AppController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('login')
  async signIn(
    @Body() body: SignInDto,
  ): Promise<TResponseStatus<TLoginPostData>> {
    const resp = await this.authService.signIn(body);
    return resp;
  }

  @Get('self')
  async self() {
    return this.authService.self();
  }
}
