import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type PrismaUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: $Enums.Role;
  hashedPassword: string;
};

@Injectable()
export class User {
  private isReady: boolean = false;
  private id: string;
  private username: string;
  private createdAt: Date;
  private updatedAt: Date;
  private email: string;
  private hashedPassword: string;
  private role: string;
  private firstName: string;
  private lastName: string;

  constructor(private prismaService: PrismaService) {}
  private setUserFromPrisma(user: PrismaUser) {
    this.id = user.id;
    this.username = user.username;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.email = user.email;
    this.hashedPassword = user.hashedPassword;
    this.role = user.role;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  public async create({
    email,
    username,
    firstName,
    lastName,
    hashedPassword,
  }: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    hashedPassword: string;
  }): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        hashedPassword,
        role: 'USER',
      },
    });

    this.isReady = true;
    this.setUserFromPrisma(user);
    return this;
  }

  public async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (user) {
      this.isReady = true;
      this.setUserFromPrisma(user);
    }
    return this;
  }

  public async findByUsername(username: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (user) {
      this.isReady = true;
      this.setUserFromPrisma(user);
    }
    return this;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) {
      this.isReady = true;
      this.setUserFromPrisma(user);
    }
    return this;
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });
    this.isReady = true;
    this.setUserFromPrisma(user);

    return this;
  }

  public async delete(id: string): Promise<void> {
    this.isReady = false;
    await this.prismaService.user.delete({ where: { id } });
  }

  public getIsReady(): boolean {
    return this.isReady;
  }

  public getId(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.id;
  }

  public getUsername(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.username;
  }

  public getCreatedAt(): Date {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.updatedAt;
  }

  public getEmail(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.email;
  }

  public getHashedPassword(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.hashedPassword;
  }

  public getRole(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.role;
  }

  public getFirstName(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.firstName;
  }

  public getLastName(): string {
    if (!this.isReady) {
      throw new Error('User is not ready');
    }
    return this.lastName;
  }
}
