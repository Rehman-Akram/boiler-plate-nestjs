import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { RoleEntity } from '../roles/entities/role.entity';
import { rolesToSeedWithPermissions } from '../roles/seeds/roles-seed-data';
import { PermissionEntity } from '../permissions/entities/permission.entity';

export default class RoleWithPermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const rolesRepository = dataSource.getRepository(RoleEntity);
      const permissionsRepository = dataSource.getRepository(PermissionEntity);
      // add USERS from users data in users/seeds/seed-data.ts
      for (const roleWithPermission of rolesToSeedWithPermissions) {
        const isExistingRole = await rolesRepository.findOne({
          where: { name: roleWithPermission.name },
        });
        if (!isExistingRole) {
          // add permissions to role
          const permissionInstance = permissionsRepository.create({
            ...roleWithPermission.permissions,
          });
          const permission = await permissionsRepository.save(permissionInstance);
          const roleInstance = rolesRepository.create({
            name: roleWithPermission.name,
            permission: permission,
          });
          await rolesRepository.save(roleInstance);

          console.log(
            '>>>>>>>>>>>>>>>>ROLE WITH PERMISSIONS CREATED SUCCESSFULLY>>>>>>>>>>>>>>>>>>',
          );
        }
      }
    } catch (error) {
      Logger.error(`Error in RoleWithPermissionSeeder`);
      throw error;
    }
  }
}
