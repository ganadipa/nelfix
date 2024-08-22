import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  Min,
  Max,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'Review content',
  })
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @ApiProperty({
    example: '1',
    description: 'Film ID',
  })
  @IsString()
  @IsNotEmpty()
  filmId: string;
}
