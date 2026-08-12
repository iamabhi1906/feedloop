import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FeedbackQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) return value as string[];
    return value ? [String(value)] : [];
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  tags?: string[];

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (Array.isArray(value)) return value as string[];
    return value ? [String(value)] : [];
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  authors?: string[];

  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
