import { Inject, Injectable } from '@nestjs/common';
import { IAuthStrategy } from '.';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TUser } from 'src/common/types';
import { IUserRepository } from 'src/modules/user/repository';

@Injectable()
export class JwtAuthStrategy implements IAuthStrategy {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,

    @Inject('UserRepository')
    private userRepo: IUserRepository,
  ) {}

  async validate(token: string): Promise<TUser> {
    const payload = await this.jwt.verifyAsync<{
      id: string;
    }>(token, {
      secret: this.config.get<string>('JWT_SECRET'),
    });
    const user = await this.userRepo.findById(payload.id);
    if (!user) {
      throw new Error('User not found, perhaps they were deleted?');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      balance: user.balance,
      token,
    };
  }

  async getToken(id: string): Promise<string> {
    const secret = this.config.get<string>('JWT_SECRET');
    return this.jwt.signAsync(
      {
        id,
      },
      { secret },
    );
  }
}
