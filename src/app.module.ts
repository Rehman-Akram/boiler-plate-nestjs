import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import {
  BadRequestExceptionFilter,
  ConflictExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
} from './shared/exceptions';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersGroupsModule } from './users-groups/users-groups.module';
import { UsersRolesModule } from './users-roles/users-roles.module';
import { GroupsModule } from './groups/groups.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionGuard } from './auth/guards/permission.guard';
import { FilesModule } from './files/files.module';

const globalFilters = [
  ConflictExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
].map((filter) => ({
  provide: APP_FILTER,
  useClass: filter,
}));
@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...dataSourceOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      cache: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    UsersGroupsModule,
    UsersRolesModule,
    GroupsModule,
    PermissionsModule,
    FilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    ...globalFilters,
  ],
})
export class AppModule {}
