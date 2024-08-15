import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { BaseResponseExceptionFilter } from './common/filters/base-response-exception-filter';
import { AuthGuard } from './modules/auth/auth.guard';
import * as hbs from 'hbs';
import './hbs-helper';

async function bootstrap() {
  // init app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // enable cors
  app.enableCors({
    origin: '*',
  });

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // use custom exception filter - base response exception filter
  app.useGlobalFilters(new BaseResponseExceptionFilter());

  // Use global guards
  const authGuard = app.get(AuthGuard);
  app.useGlobalGuards(authGuard);

  // static files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  // listen to port
  await app.listen(3333);
}
bootstrap();
