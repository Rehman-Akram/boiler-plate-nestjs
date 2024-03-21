import { PERMISSIONS } from '../shared/constants/constants';

export enum PermissionLevel {
  FULL_ACCESS = 'full',
  PARTIAL = 'partial',
  VIEW = 'view',
}

export type PermissionKeys = keyof typeof PERMISSIONS;
