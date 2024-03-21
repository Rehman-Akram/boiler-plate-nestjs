import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { GroupEntity } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { UsersGroupsService } from 'src/users-groups/users-groups.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { NotFoundError } from 'src/shared/errors';
import { ERRORS } from 'src/shared/constants/constants';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupEntity) private groupRepository: Repository<GroupEntity>,
    private readonly permissionService: PermissionsService,
    private readonly userGroupsService: UsersGroupsService,
  ) {}

  /**
   * This is to find all groups along with the count of users in that group, with pagination and search where search is optional
   *
   * @param options
   * @param take
   * @param pageNo
   * @returns [GroupEntity[], number]
   */
  async findAll(
    options: FindOptionsWhere<GroupEntity>,
    take: number,
    pageNo: number,
    searchText?: string,
  ): Promise<[GroupEntity[], number]> {
    try {
      const skip = (pageNo - 1) * take;
      const query = this.groupRepository
        .createQueryBuilder('groups')
        .where(options)
        .leftJoinAndSelect('groups.groupUsers', 'groupUsers', 'groupUsers.isDeleted = false');
      if (searchText) {
        query
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere('groups.name ~* :searchText');
            }),
          )
          .setParameter('searchText', `(${searchText})`);
      }
      query.take(take).skip(skip);
      return await query.getManyAndCount();
    } catch (error) {
      Logger.error(`Error in findAll of GroupsService where options: ${JSON.stringify(options)}`);
      throw error;
    }
  }

  /**
   * This function is used to find one group on the basis of options
   *
   * @param options
   * @returns RoleEntity
   */
  async findOneByOptions(options: FindOptionsWhere<GroupEntity>): Promise<GroupEntity> {
    try {
      return this.groupRepository.findOne({ where: options });
    } catch (error) {
      Logger.error(
        `Error in findOneByOptions of GroupsService where options: ${JSON.stringify(options)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to create group depending upon their permission level
   *
   * @param data
   * @returns GroupEntity
   */
  async create(data: CreateGroupDto): Promise<GroupEntity> {
    try {
      const { name, description, permissions } = data;
      // create permission
      const permissionCreated = await this.permissionService.create(permissions);
      // create role
      const groupData = { name, description, permission: permissionCreated };
      const roleInstance = this.groupRepository.create(groupData);
      return await this.groupRepository.save(roleInstance);
    } catch (error) {
      Logger.error(`Error in create of GroupsService where data: ${JSON.stringify(data)}`);
      throw error;
    }
  }

  /**
   * This function is used to archive group
   *
   * @param id
   * @returns UpdateResult
   */
  async archiveGroup(id: string): Promise<UpdateResult> {
    try {
      await this.groupRepository.update({ id }, { isDeleted: true });
      // update middle tables
      return await this.userGroupsService.archiveUserGroup({ groupId: id });
    } catch (error) {
      Logger.error(`Error in archiveGroup of group service where id: ${id}`);
      throw error;
    }
  }

  /**
   * This function is used to update group
   *
   * @param data
   * @returns GroupEntity
   */
  async update(id: string, data: UpdateGroupDto): Promise<GroupEntity> {
    try {
      const { name, description, permissions, userIds, isDeleted } = data;
      // get group with permission from db
      const existingGroup = await this.findOneById(id);
      if (!existingGroup) {
        throw new NotFoundError(ERRORS.RESOURCE_NOT_FOUND);
      }

      // update permissions
      if (permissions) {
        const permissionId = existingGroup.permission.id;
        await this.permissionService.update({ id: permissionId }, permissions);
      }

      // update group
      await this.groupUpdate(id, { name, description, isDeleted });

      // update middle table
      if (userIds) {
        await this.userGroupsService.updateGroupUsers(userIds, id);
      }
      // fetch new group
      return this.findOneById(id);
    } catch (error) {
      Logger.error(`Error in create of GroupsService where data: ${JSON.stringify(data)}`);
      throw error;
    }
  }

  /**
   * This function is used to update group name and description only
   *
   * @param id
   * @param '{name?: string; description?: string}'
   * returns void
   */
  async groupUpdate(
    id: string,
    data: { name?: string; description?: string; isDeleted?: boolean },
  ): Promise<void> {
    try {
      // create update group object
      const updateObject: { name?: string; description?: string; isDeleted?: boolean } = {};
      if (data.name) {
        updateObject.name = data.name;
      }
      if (data.description) {
        updateObject.description = data.description;
      }
      if (data.isDeleted === true || data.isDeleted === false) {
        updateObject.isDeleted = data.isDeleted;
      }
      await this.groupRepository.update({ id }, updateObject);
    } catch (error) {
      Logger.error(`Error in groupUpdate of GroupsService where id: ${id}`);
      throw error;
    }
  }

  /**
   * This function is used to find group by id which is not deleted along with its permissions
   *
   * @param id
   * @returns
   */
  async findOneById(id: string): Promise<GroupEntity> {
    try {
      return this.groupRepository.findOne({
        where: { id },
        relations: { permission: true },
      });
    } catch (error) {
      Logger.error(`Error in findOneById of GroupsService where id: ${id}`);
      throw error;
    }
  }

  /**
   * This is to find groups,
   *
   * @param options
   * @returns GroupEntity[]
   */
  async find(options: FindOptionsWhere<GroupEntity>): Promise<GroupEntity[]> {
    try {
      return this.groupRepository.find({ where: options });
    } catch (error) {
      Logger.error(`Error in findAll of GroupsService where options: ${JSON.stringify(options)}`);
      throw error;
    }
  }

  /**
   * This function is used to find group by id along with active users and permissions
   *
   * @param id
   * @returns GroupEntity
   */
  async findGroupByIdWithActiveUsers(id: string): Promise<GroupEntity> {
    try {
      return await this.groupRepository
        .createQueryBuilder('groups')
        .where('groups.id = :id', { id })
        .andWhere('groups.isDeleted = false')
        .leftJoinAndSelect('groups.groupUsers', 'groupUsers', 'groupUsers.isDeleted = false')
        .leftJoinAndSelect('groupUsers.user', 'user')
        .leftJoinAndSelect('groups.permission', 'permission')
        .getOne();
    } catch (error) {
      Logger.error(`Error in findGroupByIdWithActiveUsers of GroupsService where id: ${id}`);
      throw error;
    }
  }
}
