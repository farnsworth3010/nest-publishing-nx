import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsDateString()
  readonly publishedAt?: Date;

  /**
   * The id of the Author who wrote the book this news/announcement is about.
   * Not the article author.
   */
  @IsOptional()
  @IsNumber()
  readonly writerId?: number;
}
