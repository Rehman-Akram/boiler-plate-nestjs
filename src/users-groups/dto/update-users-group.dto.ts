import { PartialType } from '@nestjs/swagger';
import { CreateUsersGroupDto } from './create-users-group.dto';

export class UpdateUsersGroupDto extends PartialType(CreateUsersGroupDto) {}
