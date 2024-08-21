import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DbUserRepository } from './repository';

@Module({
  providers: [
    {
      provide: 'UserRepository',
      useClass: DbUserRepository,
    },
    UserService,
  ],
  exports: ['UserRepository', UserService],
})
export class UserModule {}
