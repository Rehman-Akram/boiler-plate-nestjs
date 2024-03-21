import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  phoneNo: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  roleId: string;
}
