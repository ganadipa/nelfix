import { NestFactory } from '@nestjs/core';
import { SeederModule } from './modules/seed/seeder.module';
import { SeederFactory } from './modules/seed/seeder.factory';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const seeder = appContext.get(SeederFactory);

  const seedTypes = ['User', 'Film', 'BoughtFilm', 'FilmReview'];

  try {
    for (const seedType of seedTypes) {
      try {
        console.log(`Seeding ${seedType} started`);
        const createdSeeder = seeder.createSeeder(seedType);
        await createdSeeder.seed();
        console.log(`Seeding ${seedType} finished`);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
