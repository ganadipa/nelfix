import { ForbiddenException, Module } from '@nestjs/common';
import { UserRepository } from './repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

ForbiddenException;

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserRepository, UserService],

  exports: [UserRepository, UserService],
})
export class UserModule {}
