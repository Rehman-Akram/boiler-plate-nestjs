import { Controller } from '@nestjs/common';
import { UsersRolesService } from './users-roles.service';

@Controller('users-roles')
export class UsersRolesController {
  constructor(private readonly usersRolesService: UsersRolesService) {}
}
