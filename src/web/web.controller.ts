import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('web')
export class WebController {
  @Get('films')
  @Render('films/index')
  getFilms() {
    return { message: 'Hello world!' };
  }
}
