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
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsString()
  @IsNotEmpty()
  filmId: string;
}
