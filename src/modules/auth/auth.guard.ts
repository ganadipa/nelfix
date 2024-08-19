import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { IAuthStrategy } from './strategy';
import { Reflector } from '@nestjs/core';
import { TUser } from 'src/common/types';
import { TAcceptableRoles } from 'src/common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';

type TRoleDecoratorMetadata = {
  roles: TAcceptableRoles[];
  redirectPath?: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_STRATEGY') private readonly strategy: IAuthStrategy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata: TRoleDecoratorMetadata = this.reflector.get(
      'authMetadata',
      context.getHandler(),
    );
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    const tokenFromHeader = this.extractTokenFromHeader(request);
    const tokenFromCookie = this.extractTokenFromCookie(request);

    let creds: TUser[] = [];

    // Check token from header
    try {
      const payload = await this.strategy.validate(tokenFromHeader);
      creds.push(payload);
    } catch (e) {
      // Do nothing
    }

    // Check token from cookie
    try {
      const payload = await this.strategy.validate(tokenFromCookie);
      creds.push(payload);
    } catch (e) {
      // Do nothing
    }
    console.log('creds', creds);

    if (creds.length === 1) {
      request.user = creds[0];
    }

    if (creds.length > 1 && creds.every((c) => c.id === creds[0].id)) {
      request.user = creds[0];
    }

    if (!metadata) {
      return false;
    }

    const roles = metadata.roles;
    const redirectPath = metadata.redirectPath;
    const isAllowed = this.checkCondition(roles, creds);
    console.log('isAllowed', isAllowed);

    if (!isAllowed && redirectPath) {
      const response = context.switchToHttp().getResponse();
      response.redirect(redirectPath);
      return false;
    }

    if (!isAllowed) {
      return false;
    }

    // Here, it means one of the following conditions is met:
    // 1. no creds and roles includes 'GUEST'
    // 2. have creds and roles includes the role of the user

    // Assertion, just to make sure
    if (
      !(
        (creds.length === 0 && roles.includes('GUEST')) ||
        (creds.length > 0 && roles.includes(creds[0].role))
      )
    ) {
      throw new HttpException('Logic error', 500);
    }

    return true;
  }

  private checkCondition(roles: TAcceptableRoles[], creds: TUser[]): boolean {
    if (!roles) {
      return false;
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

    return true;
  }

  private extractTokenFromHeader(request: ExtendedRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: ExtendedRequest): string | undefined {
    const cookie = request.headers.cookie;
    if (!cookie) {
      return;
    }

    const pair = cookie.split('; ').find((c) => c.includes('token'));
    if (!pair) {
      return;
    }

    const [_, value] = pair.split('=');

    return value;
  }
}
