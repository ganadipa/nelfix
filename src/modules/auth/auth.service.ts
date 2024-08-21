import {
  ForbiddenException,
  Inject,
  Injectable,
  Post,
  Req,
} from '@nestjs/common';
import { RegisterDto, RestApiSignInDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { IAuthStrategy } from './strategy';
import { TLoginPostData, TResponseStatus, TRole } from 'src/common/types';
import { IUserRepository } from '../user/repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private userRepo: IUserRepository,
    @Inject('AUTH_STRATEGY') private authStrategy: IAuthStrategy,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await argon.hash(dto.password);

    const usernameAndEmail = [dto.username, dto.email];

    for (const field of usernameAndEmail) {
      const byUsername = await this.userRepo.findByUsername(field);
      const byEmail = await this.userRepo.findByEmail(field);
      if (byUsername || byEmail)
        throw new Error(
          'Please change your username as that identifier is already in use',
        );
    }

    const usernameExist = await this.userRepo.findByUsername(dto.username);
    const emailExist = await this.userRepo.findByEmail(dto.email);

    if (usernameExist) {
      throw new Error('Username already exists');
    }

    if (emailExist) {
      throw new Error('Email already exists');
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
      id: user.id,
      username: user.username,
      email: user.email,
      token: await this.signToken(user.id),
    };
  }

  async signIn(dto: SignInDto): Promise<TLoginPostData> {
    const byUsername = await this.userRepo.findByUsername(
      dto.username_or_email,
    );
    const byEmail = await this.userRepo.findByEmail(dto.username_or_email);

    if (byUsername && byEmail && byEmail.id !== byUsername.id) {
      throw new Error(
        "Database issue: Found two users, but system doesn't know which one to use",
      );
    }

    let user = byUsername || byEmail;

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await argon.verify(user.hashedPassword, dto.password);

    if (!valid) {
      throw new Error('Invalid credentials');
    }

    return {
      username: user.username,
      token: await this.signToken(user.id),
    };
  }

  async signInUsingUsername(dto: RestApiSignInDto) {
    return this.signIn({
      username_or_email: dto.username,
      password: dto.password,
    });
  }

  async signToken(id: string) {
    const token = await this.authStrategy.getToken(id);
    return token;
  }
}
