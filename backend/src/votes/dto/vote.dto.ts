import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { VoteType } from '../enums/vote-type.enum';

export class VoteDto {
  @IsNotEmpty()
  @IsUUID()
  feedbackId!: string;

  @IsNotEmpty()
  @IsEnum(VoteType)
  type!: VoteType;
}
