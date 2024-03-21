import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { REGEX } from '../../shared/constants/constants';

export class UpdatePasswordDto {
  @IsString()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  @MinLength(8, { message: 'Must be greator than 8 characters' })
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one special character',
  })
  oldPassword: string;

  @IsString()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  @MinLength(8, { message: 'Must be greator than 8 characters' })
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one special character',
  })
  newPassword: string;
}
