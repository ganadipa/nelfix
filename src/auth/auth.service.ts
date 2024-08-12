import { ForbiddenException, Inject, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TLoginPostData, TResponseStatus } from 'src/types';
import { User } from 'src/user/user.entity';
import { Response } from 'express';
import { IAuthStrategy } from './strategy';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    @Inject('AUTH_STRATEGY') private authStrategy: IAuthStrategy,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashed = await argon.hash(dto.password);

      const usernameExist = await new User(this.prismaService).findByUsername(
        dto.username,
      );
      const emailExist = await new User(this.prismaService).findByEmail(
        dto.email,
      );

      if (usernameExist.getIsReady()) {
        throw new ForbiddenException('Username already exists');
      }

      if (emailExist.getIsReady()) {
        throw new ForbiddenException('Email already exists');
      }

      const user = await new User(this.prismaService).create({
        email: dto.email,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        hashedPassword: hashed,
      });

      return {
        status: 'success',
        message: 'User created',
        data: {
          id: user.getId(),
          username: user.getUsername(),
          email: user.getEmail(),
          token: await this.signToken({
            userId: user.getId(),
            username: user.getUsername(),
            email: user.getEmail(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            role: user.getRole(),
          }),
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
    const user = await new User(this.prismaService).findByUsername(
      dto.username,
    );

    if (!user.getIsReady()) {
      return {
        status: 'error',
        message: 'Invalid credentials',
        data: null,
      };
    }

    const valid = await argon.verify(user.getHashedPassword(), dto.password);

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
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        token: await this.signToken({
          userId: user.getId(),
          username: user.getUsername(),
          email: user.getEmail(),
          firstName: user.getFirstName(),
          lastName: user.getLastName(),
          role: user.getRole(),
        }),
      },
    };
  }

  async signToken({
    userId,
    username,
    email,
    firstName,
    lastName,
    role,
  }: {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    const payload = { userId, username, email, firstName, lastName, role };
    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret,
    });

    return token;
  }

  async validateToken(token: string) {
    return this.jwt.verifyAsync(token);
  }

  async self() {}
}
