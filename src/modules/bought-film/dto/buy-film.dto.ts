import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BuyFilmDto {
  @ApiProperty({
    example: '1',
    description: 'Id of the film',
  })
  @IsNumber()
  @IsNotEmpty()
  filmId: number;
}
