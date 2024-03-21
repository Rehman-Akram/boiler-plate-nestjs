import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { RoleEntity } from '../roles/entities/role.entity';
import { usersData } from '../users/seeds/users-seed-data';
import { UserEntity } from '../users/entities/user.entity';
import { NotFoundError } from '../shared/errors';
import { ERRORS } from '../shared/constants/constants';
import { UserRoleEntity } from '../users-roles/entities/users-role.entity';

export default class UsersWithRolesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const rolesRepository = dataSource.getRepository(RoleEntity);
      const usersRepository = dataSource.getRepository(UserEntity);
      const userRolesRepository = dataSource.getRepository(UserRoleEntity);
      // add USERS from users data in users/seeds/seed-data.ts
      for (const userWithRole of usersData) {
        const isExistingUser = await usersRepository.findOne({
          where: { email: userWithRole.email },
        });
        if (!isExistingUser) {
          const { role, ...rest } = userWithRole;
          // fetch role
          const roleFetched = await rolesRepository.findOne({
            where: { name: role },
          });
          if (!roleFetched) {
            Logger.error(`Role with name ${userWithRole.role} not found in users seeder`);
            throw new NotFoundError(ERRORS.RESOURCE_NOT_FOUND);
          }
          const userInstance = usersRepository.create(rest);
          const user = await usersRepository.save(userInstance);
          // add user in middle table
          const userRolesInstance = userRolesRepository.create({
            userId: user.id,
            roleId: roleFetched.id,
          });
          await userRolesRepository.save(userRolesInstance);
          console.log('>>>>>>>>>>>>>>>>USER WITH ROLES CREATED SUCCESSFULLY>>>>>>>>>>>>>>>>>>');
        }
      }
    } catch (error) {
      Logger.error(`Error in UsersWithRolesSeeder`);
      throw error;
    }
  }
}
