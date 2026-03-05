import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsNumber()
  readonly roleId: number;

  @IsOptional()
  @IsNumber()
  readonly officeId: number;
}
