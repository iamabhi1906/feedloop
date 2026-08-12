import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class LoginDTO {
  @IsOptional()
  @IsString({ message: 'Login must be a string' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email?: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password!: string;
}
