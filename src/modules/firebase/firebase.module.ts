import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseRepository } from './firebase.repository';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return admin.initializeApp({
      credential: admin.credential.cert('nelfix-firebase-adminsdk.json'),
      storageBucket: configService.get<string>('STORAGE_BUCKET'),
    });
  },
};

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseRepository],
  exports: [FirebaseRepository, firebaseProvider],
})
export class FirebaseModule {}
