import { PERMISSIONS, ROLES } from '../../shared/constants/constants';

export const rolesToSeedWithPermissions = [
  {
    name: ROLES.SUPER_ADMIN,
    // We may add more permissions subjected to entity level, just add here. For boiler plate restricted to two entities
    permissions: {
      [PERMISSIONS.USERS]: { create: true, read: true, update: true, delete: true },
      [PERMISSIONS.ROLES]: { create: true, read: true, update: true, delete: true },
    },
  },
  // When no permission is given, it will be considered as false for that entity
  {
    name: ROLES.ADMIN,
    permissions: {
      [PERMISSIONS.USERS]: { create: true, read: true, update: true, delete: true },
    },
  },
];
