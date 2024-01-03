import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'])) {}
