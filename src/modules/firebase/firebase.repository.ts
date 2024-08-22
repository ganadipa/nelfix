import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseRepository {
  #db: FirebaseFirestore.Firestore;
  private bucket = admin.storage().bucket();

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#db = firebaseApp.firestore();
  }

  async addFile(file: Express.Multer.File, filename: string): Promise<string> {
    const fileRef = this.bucket.file(filename);
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    await fileRef.makePublic(); // Make the file publicly accessible
    return `https://storage.googleapis.com/${this.bucket.name}/${fileRef.name}`;
  }

  async removeFile(fileName: string): Promise<void> {
    const fileRef = this.bucket.file(fileName);
    await fileRef.delete();
  }

  async removeFileByUrl(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      try {
        await this.removeFile(fileName);
      } catch (error) {}
    }
  }
}
