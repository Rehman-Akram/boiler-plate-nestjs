import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { UserStatus } from '../enums/status.enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOtherUserDto extends PartialType(
  OmitType(UserEntity, ['email', 'createdAt', 'updatedAt', 'phoneVerified', 'emailVerified']),
) {
  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles: string[];

  @ApiProperty({ required: false, enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;
}
