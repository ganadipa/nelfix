import { Injectable } from '@nestjs/common';

export interface ISeeder<T> {
  seed(): Promise<void>;
  logSeeding(entityName: string, entity: T): void;
}

@Injectable()
export abstract class Seeder<T> implements ISeeder<T> {
  abstract seed(): Promise<void>;

  logSeeding(entityName: string, entity: T): void {
    console.log(`Seeding ${entityName}: ${JSON.stringify(entity)}`);
  }
}
