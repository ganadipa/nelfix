import {
  ForbiddenException,
  Inject,
  Injectable,
  Post,
  Req,
} from '@nestjs/common';
import { RegisterDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { IAuthStrategy } from './strategy';
import { TLoginPostData, TResponseStatus, TRole } from 'src/common/types';
import { UserRepository } from '../user/repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    @Inject('AUTH_STRATEGY') private authStrategy: IAuthStrategy,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashed = await argon.hash(dto.password);

      const usernameExist = await this.userRepo.findByUsername(dto.username);
      const emailExist = await this.userRepo.findByEmail(dto.email);

      if (usernameExist) {
        throw new ForbiddenException('Username already exists');
      }

      if (emailExist) {
        throw new ForbiddenException('Email already exists');
      }

      const user = await this.userRepo.create({
        username: dto.username,
        email: dto.email,
        hashedPassword: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        balance: 0,
      });

      return {
        status: 'success',
        message: 'User created',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          token: await this.signToken(user.id),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async signIn(dto: SignInDto): Promise<TResponseStatus<TLoginPostData>> {
    const user = await this.userRepo.findByUsername(dto.username);

    if (!user) {
      return {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      };
    }

    const valid = await argon.verify(user.hashedPassword, dto.password);

    if (!valid) {
      return {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      };
    }

    return {
      status: 'success',
      message: "User's credentials are valid",
      data: {
        username: user.username,
        token: await this.signToken(user.id),
      },
    };
  }

  async signToken(id: string) {
    const token = await this.authStrategy.getToken(id);
    return token;
  }
}
