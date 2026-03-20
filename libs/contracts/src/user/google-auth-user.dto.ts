import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly googleId: string;
}
