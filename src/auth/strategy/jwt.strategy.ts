import { Injectable } from '@nestjs/common';
import { IAuthStrategy } from '.';
import { JwtService } from '@nestjs/jwt';
import { TUser } from 'src/types';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

type TJwtPayload = Omit<TUser, 'id'> & { userId: string; iat: number };

@Injectable()
export class JwtAuthStrategy implements IAuthStrategy {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  validate(token: string): TUser {
    const payload = this.jwt.verify<TJwtPayload>(token, {
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
    };
  }
}
