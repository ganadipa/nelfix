import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategy/jwt.strategy';

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
