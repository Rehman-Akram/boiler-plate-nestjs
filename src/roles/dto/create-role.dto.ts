import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { PermissionKeys, PermissionLevel } from '../../permissions/permissions.enum';

export class CreateRoleDto {
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  //TODO: Add Nested validation for permissions
  @IsObject()
  permissions: { [key in PermissionKeys]: PermissionLevel };
}
