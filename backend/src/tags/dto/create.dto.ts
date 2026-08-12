import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTagDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
