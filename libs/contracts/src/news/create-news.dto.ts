import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly publishedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly writerId?: number;
}
