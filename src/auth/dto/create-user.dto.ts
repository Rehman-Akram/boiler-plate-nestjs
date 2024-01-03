import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UserStatus } from 'src/users/enums/user.enum';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  middleName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  lastName: string;

  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsString()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  @MinLength(8, { message: 'Must be greator than 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one special character',
  })
  password: string;

  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: false, enum: UserRole, isArray: true })
  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles: UserRole[];
}
