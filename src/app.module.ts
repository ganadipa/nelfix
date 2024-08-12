import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WebModule } from './web/web.module';
import { AppController } from './app.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthStrategy } from './auth/strategy/jwt.strategy';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    WebModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AuthService, JwtService],
})
export class AppModule {}
