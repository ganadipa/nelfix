import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('auth/login/index')
  @Roles(['GUEST'], '/web/films')
  getLogin() {
    return { message: 'Hello world!' };
  }

  @Get('register')
  @Render('auth/register/index')
  @Roles(['GUEST'], '/web/films')
  getRegister() {
    return {
      fields: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'username', label: 'Username', type: 'text', required: true },
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
        },

        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
        },
      ],
    };
  }
}
