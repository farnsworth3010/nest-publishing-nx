import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  readonly publishedAt?: Date;

  /**
   * The id of the Author who wrote the book this news/announcement is about.
   * Not the article author.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly writerId?: number;
}
