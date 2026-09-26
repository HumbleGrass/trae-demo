import { IsNumber, Min, IsOptional } from 'class-validator';

export class CreateFineDto {
  @IsNumber()
  @Min(0)
  memberId: number;

  @IsNumber()
  @Min(1)
  borrowRecordId: number;

  @IsNumber()
  @Min(0)
  fineAmount: number;

  @IsNumber()
  @IsOptional()
  overdueDays?: number;

  @IsOptional()
  fineDate?: Date;
}