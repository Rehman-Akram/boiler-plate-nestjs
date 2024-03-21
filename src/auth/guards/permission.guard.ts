import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERRORS } from '../../shared/constants/constants';
import { UnauthroizedError } from '../../shared/errors';
import { UserRoleEntity } from '../../users-roles/entities/users-role.entity';
import { UserGroupEntity } from '../../users-groups/entities/users-group.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionsService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      // checking if route is public
      const isPublic = this.reflector.get<string>('isPublic', context.getHandler());
      if (isPublic) {
        return true;
      }
      // aggregate user permissions as single object
      const request = context.switchToHttp().getRequest();
      const userRoles: UserRoleEntity[] = request.user.userRoles;
      const userGroupRoles: UserGroupEntity[] = request.user.userGroups;
      request.user.permissions = this.permissionService.mergePermissions(userRoles, userGroupRoles);

      const requiredRoutePermissions = this.reflector.get<object[]>(
        'permissions',
        context.getHandler(),
      );
      if (!requiredRoutePermissions) {
        return true;
      }
      // if user and id in params are same then allow (this is that user can update his own record without any permission)
      if (request.params && request.params.id && request.params.id === request.user.id) {
        return true;
      }
      //TODO: stop create/update/delete of super admin if user is not super admin

      // check if user has required permissions
      const hasPermissions = requiredRoutePermissions.every((requiredPermission) =>
        Object.entries(requiredPermission).every(
          ([permissionType, permission]) =>
            request.user.permissions[permissionType] &&
            request.user.permissions[permissionType][Object.keys(permission)[0]],
        ),
      );

      if (hasPermissions) {
        return true;
      }
      throw new UnauthroizedError(ERRORS.UN_AUTHORIZED);
    } catch (error) {
      Logger.error('Error in canActivate of Permission Guard');
      throw error;
    }
  }
}
