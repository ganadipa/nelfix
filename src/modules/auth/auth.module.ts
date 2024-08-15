import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [UserModule, PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_STRATEGY',
      useClass: JwtAuthStrategy,
    },
    AuthService,
    AuthGuard,
  ],
  exports: ['AUTH_STRATEGY', UserModule, AuthGuard],
})
export class AuthModule {}
