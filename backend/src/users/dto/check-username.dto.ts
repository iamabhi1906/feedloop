import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CheckUserNameDTO {
  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Username must at lest 3 latter long' })
  @MaxLength(100, { message: 'Username must not exceed 100 characters' })
  username!: string;
}
