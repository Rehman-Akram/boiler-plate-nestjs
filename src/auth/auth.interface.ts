import { PermissionObject } from '../permissions/permission.interface';

export interface TokenPayload {
  id: string;
}

export interface UserPermission {
  [key: string]: PermissionObject;
}
