import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsOptional()
  @IsDateString()
  readonly publishedAt?: Date;

  @IsOptional()
  @IsNumber()
  readonly writerId?: number;
}
