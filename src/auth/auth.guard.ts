import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IAuthStrategy } from './strategy';
import { Reflector } from '@nestjs/core';
import { TUser } from 'src/types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_STRATEGY') private readonly strategy: IAuthStrategy,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.checkCondition(context);
  }

  private checkCondition(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const tokenFromHeader = this.extractTokenFromHeader(request);
    const tokenFromCookie = this.extractTokenFromCookie(request);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return false;
    }

    if (!tokenFromHeader && !tokenFromCookie) {
      return roles.includes('GUEST');
    }

    let creds: TUser[] = [];

    // Check token from header
    try {
      const payload = this.strategy.validate(tokenFromHeader);
      creds.push(payload);
      request['user'] = payload;
    } catch (e) {
      // Do nothing
    }

    // Check token from cookie
    try {
      const payload = this.strategy.validate(tokenFromCookie);
      creds.push(payload);
      request['user'] = payload;
    } catch (e) {
      // Do nothing
    }

    if (creds.length === 0) {
      return roles.includes('GUEST');
    }

    if (creds.length > 1 && creds.every((c) => c.id === creds[0].id)) {
      return false;
    }

    if (!roles.includes(creds[0].role)) {
      return false;
    }

    request['user'] = creds[0];
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const cookie = request.headers.cookie;
    if (!cookie) {
      return;
    }

    const pair = cookie.split('; ').find((c) => c.includes('token'));
    if (!pair) {
      return;
    }

    const [key, value] = pair.split('=');

    return value;
  }
}
