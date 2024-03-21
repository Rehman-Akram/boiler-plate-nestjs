import { Injectable, Logger } from '@nestjs/common';
import { UserRoleEntity } from './entities/users-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersRolesService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private usersRoleRepository: Repository<UserRoleEntity>,
  ) {}
  /**
   * This function is used to add record in userRole table
   *
   * @param param0
   * @returns
   */
  create({ userId, roleId }: { userId: string; roleId: string }): Promise<UserRoleEntity> {
    try {
      const userRolesInstance = this.usersRoleRepository.create({ userId, roleId });
      return this.usersRoleRepository.save(userRolesInstance);
    } catch (error) {
      Logger.error(
        `Error in create of usersRoles service where credentials: ${JSON.stringify({
          userId,
          roleId,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to update userRole record to isDeleted true
   *
   * @param userId
   * @param roleId
   * @returns UpdatedResult
   */
  archiveUserRole({ userId, roleId }: { userId?: string; roleId?: string }): Promise<UpdateResult> {
    try {
      const options: { userId?: string; roleId?: string } = {};
      if (userId) {
        options.userId = userId;
      }
      if (roleId) {
        options.roleId = roleId;
      }
      return this.usersRoleRepository.update(options, { isDeleted: true });
    } catch (error) {
      Logger.error(
        `Error in archiveUserRoles of usersRoles service where credentials: ${JSON.stringify({
          userId,
          roleId,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find userRole records
   *
   * @param param0
   * @returns userRoleEntity[]
   */
  async find({ userId, roleId }: { userId?: string; roleId?: string }): Promise<UserRoleEntity[]> {
    try {
      return this.usersRoleRepository.find({ where: { userId, roleId, isDeleted: false } });
    } catch (error) {
      Logger.error(
        `Error in find of usersRoles service where credentials: ${JSON.stringify({
          userId,
          roleId,
        })}`,
      );
      throw error;
    }
  }
}
