import { Module } from '@nestjs/common';
import { UsersGroupsService } from './users-groups.service';
import { UsersGroupsController } from './users-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroupEntity } from './entities/users-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroupEntity])],
  controllers: [UsersGroupsController],
  providers: [UsersGroupsService],
  exports: [UsersGroupsService],
})
export class UsersGroupsModule {}
