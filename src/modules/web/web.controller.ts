import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../../common/decorator/roles.decorator';

@UseGuards(AuthGuard)
@Controller('web')
export class WebController {
  @Get('films')
  @Render('films/index')
  @Roles(['USER', 'ADMIN'], '/auth/login')
  getFilms() {
    return { message: 'Hello world!' };
  }
}
