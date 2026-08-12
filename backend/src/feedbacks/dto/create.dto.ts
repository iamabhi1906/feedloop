import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import FeedbackVisibility from '../enums/feedback-visibility.enum';

export class CreateFeedbackDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsEnum(FeedbackVisibility)
  visibility: FeedbackVisibility = FeedbackVisibility.PUBLIC;
}
