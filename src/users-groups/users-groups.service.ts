import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity } from './entities/users-group.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersGroupsService {
  constructor(
    @InjectRepository(UserGroupEntity)
    private readonly userGroupRepository: Repository<UserGroupEntity>,
  ) {}

  /**
   * This function is used to add record in userGroup table
   *
   * @param param0
   * @returns
   */
  create({ userId, groupId }: { userId: string; groupId: string }): Promise<UserGroupEntity> {
    try {
      const userGroupsInstance = this.userGroupRepository.create({ userId, groupId });
      return this.userGroupRepository.save(userGroupsInstance);
    } catch (error) {
      Logger.error(
        `Error in create of usersGroup service where credentials: ${JSON.stringify({
          userId,
          groupId,
        })}`,
      );
      throw error;
    }
  }
  /**
   * This function is used to update userGroup record to isDeleted true
   *
   * @param userId
   * @param groupId
   * @returns UpdatedResult
   */
  archiveUserGroup({
    userId,
    groupId,
  }: {
    userId?: string;
    groupId?: string;
  }): Promise<UpdateResult> {
    try {
      const options: { userId?: string; groupId?: string } = {};
      if (userId) {
        options.userId = userId;
      }
      if (groupId) {
        options.groupId = groupId;
      }
      return this.userGroupRepository.update(options, { isDeleted: true });
    } catch (error) {
      Logger.error(
        `Error in archiveUserRoles of usersRoles service where credentials: ${JSON.stringify({
          userId,
          groupId,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find userGroup records
   *
   * @param param0
   * @returns userGroupEntity[]
   */
  async find({
    userId,
    groupId,
  }: {
    userId?: string;
    groupId?: string;
  }): Promise<UserGroupEntity[]> {
    try {
      return this.userGroupRepository.find({ where: { userId, groupId, isDeleted: false } });
    } catch (error) {
      Logger.error(
        `Error in find of usersGroup service where credentials: ${JSON.stringify({
          userId,
          groupId,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to soft delete user's previous roles and add new roles to user without changing previous same roles
   *
   * @param roles
   * @param userId
   */
  async updateGroupUsers(currentUserIds: string[], groupId: string): Promise<void> {
    try {
      // Get group's previous users
      const groupUsers = await this.find({ groupId });

      // Extract previous user ids
      const groupUsersIds = groupUsers.map((groupUser) => groupUser.userId);

      // Find roles to delete
      const usersToDelete = groupUsersIds.filter((userId) => !currentUserIds.includes(userId));

      // Find users to add
      const usersToAdd = currentUserIds.filter((userId) => !groupUsersIds.includes(userId));

      // Delete users that need to be deleted
      for (const userId of usersToDelete) {
        await this.archiveUserGroup({ userId, groupId });
      }

      // Add roles that need to be added
      for (const userId of usersToAdd) {
        await this.create({ userId, groupId });
      }
    } catch (error) {
      Logger.error(`Error in updateGroupUsers of group service where groupId: ${groupId}`);
      throw error;
    }
  }
}
