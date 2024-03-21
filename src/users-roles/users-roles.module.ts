import { Module } from '@nestjs/common';
import { UsersRolesService } from './users-roles.service';
import { UsersRolesController } from './users-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from './entities/users-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleEntity])],
  controllers: [UsersRolesController],
  providers: [UsersRolesService],
  exports: [UsersRolesService],
})
export class UsersRolesModule {}
