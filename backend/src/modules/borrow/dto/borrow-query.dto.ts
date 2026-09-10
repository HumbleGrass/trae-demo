import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BorrowQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  memberId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  bookId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;
}