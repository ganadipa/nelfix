import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { TBaseViewData } from 'src/common/types';
import { ApiTags } from '@nestjs/swagger';

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

@ApiTags('Front End')
@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('login')
  @Render('auth/login')
  @Roles(['GUEST'], '/web/films')
  getLogin(): TBaseViewData & TLoginViewsData {
    return {
      title: 'Login',

      fields: [
        {
          name: 'username_or_email',
          label: 'Username/ Email',
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

      scripts: ['/js/login.js', '/js/input.js', '/js/navbar.js'],

      pathname: '/auth/login',

      description: 'Login to Nelfix',
    };
  }

  @Get('register')
  @Render('auth/register')
  @Roles(['GUEST'], '/web/films')
  getRegister(): TRegisterViewsData & TBaseViewData {
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

      pathname: '/auth/register',

      description: 'Register for Nelfix',
    };
  }
}
