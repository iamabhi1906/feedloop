import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
