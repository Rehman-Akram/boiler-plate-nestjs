import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersRolesModule } from '../users-roles/users-roles.module';
import { RolesModule } from '../roles/roles.module';
import { SharedModule } from '../shared/shared.module';
import { UsersGroupsModule } from '../users-groups/users-groups.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UsersRolesModule,
    RolesModule,
    SharedModule,
    UsersGroupsModule,
    PermissionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
