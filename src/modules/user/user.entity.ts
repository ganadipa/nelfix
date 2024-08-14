import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { TPrismaUser, TUser, TUserJson } from '../../common/types';

@Injectable()
export class User {
  private id: string;
  private username: string;
  private createdAt: Date;
  private updatedAt: Date;
  private email: string;
  private hashedPassword: string;
  private role: $Enums.Role;
  private firstName: string;
  private lastName: string;
  private balance: number;

  constructor(prismaUser: TPrismaUser) {
    this.id = prismaUser.id;
    this.username = prismaUser.username;
    this.createdAt = prismaUser.createdAt;
    this.updatedAt = prismaUser.updatedAt;
    this.email = prismaUser.email;
    this.hashedPassword = prismaUser.hashedPassword;
    this.role = prismaUser.role;
    this.firstName = prismaUser.firstName;
    this.lastName = prismaUser.lastName;
    this.balance = prismaUser.balance;
  }

  public toJSON(): TUserJson {
    return {
      id: this.id,
      username: this.username,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      email: this.email,
      hashed_password: this.hashedPassword,
      role: this.role,
      first_name: this.firstName,
      last_name: this.lastName,
      balance: this.balance,
    };
  }
}
