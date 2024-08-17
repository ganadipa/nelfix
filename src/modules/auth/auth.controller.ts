import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/common/decorator/roles.decorator';

type TLoginViewsData = {
  title: string;
  fields: { name: string; label: string; type: string; required: boolean }[];
  scripts: string[];
};

type TRegisterViewsData = {
  title: string;
  fields: { name: string; label: string; type: string; required: boolean }[];
  scripts: string[];
};

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('login')
  @Render('auth/login')
  @Roles(['GUEST'], '/web/films')
  getLogin(): TLoginViewsData {
    return {
      title: 'Login',

      fields: [
        { name: 'username', label: 'Username', type: 'text', required: true },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
        },
      ],

      scripts: ['/js/login.js', '/js/input.js', '/js/navbar.js'],
    };
  }

  @Get('register')
  @Render('auth/register')
  @Roles(['GUEST'], '/web/films')
  getRegister(): TRegisterViewsData {
    return {
      title: 'Register',
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
      scripts: ['/js/register.js', '/js/input.js'],
    };
  }
}
