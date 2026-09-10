import { IsString, IsNumber, IsOptional, MaxLength, IsEmail } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsString()
  @MaxLength(20)
  idCard: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  gender?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsNumber()
  @IsOptional()
  borrowLimit?: number;
}

export class CreateMemberWithUserDto {
  @IsString()
  @MaxLength(50)
  username: string;

  @IsString()
  @MaxLength(100)
  password: string;

  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsString()
  @MaxLength(20)
  idCard: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  gender?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsNumber()
  @IsOptional()
  borrowLimit?: number;
}