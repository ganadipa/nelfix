import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { BaseResponseExceptionFilter } from './common/filters/base-response-exception-filter';
import { AuthGuard } from './modules/auth/auth.guard';
import * as hbs from 'hbs';
import './hbs-helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Nelfix API')
    .setDescription('The Nelfix API description')
    .setVersion('1.0')
    .addTag('nelfix')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter only the JWT token, without the Bearer string',
      },
      'JWT-auth',
    )
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  // listen to port
  await app.listen(3333);
}
bootstrap();
