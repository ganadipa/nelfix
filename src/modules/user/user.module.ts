import { Module } from '@nestjs/common';
import { UserRepository } from './repository';
import { UserService } from './user.service';

@Module({
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
