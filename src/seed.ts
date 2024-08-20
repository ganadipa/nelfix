import { NestFactory } from '@nestjs/core';
import { SeederModule } from './modules/seed/seeder.module';
import { SeederFactory } from './modules/seed/seeder.factory';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seeder = appContext.get(SeederFactory);

  try {
    await seeder.run();
  } catch (error) {
  } finally {
    await appContext.close();
  }
}

bootstrap();
