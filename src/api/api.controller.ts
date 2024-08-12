import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto, SignInDto } from 'src/auth/dto';
import { TLoginPostData, TResponseStatus } from 'src/types';

@Controller('api')
export class ApiController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<TResponseStatus<TLoginPostData>> {
    const resp = await this.authService.signIn(body);
    console.log(req);

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
}
