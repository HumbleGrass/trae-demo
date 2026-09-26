import { IsNumber, Min, IsOptional } from 'class-validator';

export class CreateBorrowDto {
  @IsNumber()
  @Min(1)
  bookId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  memberId?: number;
}