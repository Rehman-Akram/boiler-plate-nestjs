import { PartialType } from '@nestjs/swagger';
import { CreateUsersRoleDto } from './create-users-role.dto';

export class UpdateUsersRoleDto extends PartialType(CreateUsersRoleDto) {}
