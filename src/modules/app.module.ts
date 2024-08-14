import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WebModule } from './web/web.module';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { AuthService } from './auth/auth.service';
import { FilmModule } from './film/film.module';

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
    FilmModule,
  ],
  controllers: [AppController],
  providers: [AuthService, JwtService],
})
export class AppModule {}
