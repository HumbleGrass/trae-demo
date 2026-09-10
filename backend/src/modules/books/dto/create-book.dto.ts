import { IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MaxLength(20)
  isbn: string;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(100)
  author: string;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  publisher?: string;

  @IsString()
  @IsOptional()
  publishDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  cover?: string;
}