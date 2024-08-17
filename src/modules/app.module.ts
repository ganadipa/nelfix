import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WebModule } from './web/web.module';
import { ApiModule } from './api/api.module';
import { RestApiController } from './rest-api.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    WebModule,
    ApiModule,
  ],
  controllers: [RestApiController],
})
export class AppModule {}
