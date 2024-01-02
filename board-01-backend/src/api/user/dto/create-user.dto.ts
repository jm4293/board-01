import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly age: number;

  @IsString()
  readonly phone: string;
}
