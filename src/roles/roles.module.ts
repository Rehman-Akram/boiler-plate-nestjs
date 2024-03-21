import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersRolesModule } from '../users-roles/users-roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), PermissionsModule, UsersRolesModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
