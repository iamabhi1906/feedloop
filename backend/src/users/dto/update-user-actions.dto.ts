import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserActionsDTO {
  @IsOptional()
  @IsBoolean()
  isLoginDisabled?: boolean;

  @IsOptional()
  @IsBoolean()
  hideFeedbacks?: boolean;

  @IsOptional()
  @IsBoolean()
  hideComments?: boolean;
}
