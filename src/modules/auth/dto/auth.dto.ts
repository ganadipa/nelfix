import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'example@example.com',
    description: 'Email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'username',
    description: 'Username of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class RestApiSignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @ApiProperty({
    example: 'example@example.com' || 'username',
    description: 'Username or email of the user',
  })
  @IsString()
  @IsNotEmpty()
  username_or_email: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
