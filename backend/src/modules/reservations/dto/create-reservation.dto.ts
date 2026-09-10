import { IsNumber, Min } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @Min(1)
  bookId: number;
}