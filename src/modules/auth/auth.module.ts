import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_STRATEGY',
      useClass: JwtAuthStrategy,
    },
    AuthService,
  ],
  exports: ['AUTH_STRATEGY'],
})
export class AuthModule {}
