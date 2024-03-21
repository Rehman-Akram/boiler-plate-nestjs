import { Controller } from '@nestjs/common';
import { UsersGroupsService } from './users-groups.service';
@Controller('users-groups')
export class UsersGroupsController {
  constructor(private readonly usersGroupsService: UsersGroupsService) {}
}
