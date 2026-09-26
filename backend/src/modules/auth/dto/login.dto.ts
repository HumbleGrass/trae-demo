import { IsString, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}