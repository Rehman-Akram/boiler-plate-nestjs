import { OmitType, PartialType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(UserEntity, ['email', 'createdAt', 'updatedAt', 'phoneVerified', 'emailVerified']),
) {}
