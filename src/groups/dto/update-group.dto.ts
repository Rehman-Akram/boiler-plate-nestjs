import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userIds: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}
