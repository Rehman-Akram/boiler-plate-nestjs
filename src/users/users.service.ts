import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { EMAIL_SUBJECTS, EMAIL_TEMPLATES, ERRORS } from '../shared/constants/constants';
import { UserStatus } from './enums/status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRolesService } from '../users-roles/users-roles.service';
import { RolesService } from '../roles/roles.service';
import {
  NotFoundError,
  ConflictError,
  UnauthroizedError,
  BadRequestError,
} from 'src/shared/errors';
import { CreateUser } from './users.interface';
import { EmailService } from '../shared/email.service';
import { UsersGroupsService } from '../users-groups/users-groups.service';
import { UpdateOtherUserDto } from './dto/update-other-user.dto';
import { RoleEntity } from '../roles/entities/role.entity';
import { Utils } from '../shared/utils/utils';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '../shared/shared.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserRoleEntity } from '../users-roles/entities/users-role.entity';
import { UserGroupEntity } from '../users-groups/entities/users-group.entity';
import { PermissionsService } from '../permissions/permissions.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly userRolesService: UsersRolesService,
    private readonly roleService: RolesService,
    private readonly emailService: EmailService,
    private readonly userGroupsService: UsersGroupsService,
    private readonly configService: ConfigService,
    private readonly sharedService: SharedService,
    private readonly permissionService: PermissionsService,
  ) {}

  /**
   * This function is used to find user if exist either by email or phoneNo
   *
   * @param email
   * @param phoneNo
   * @returns Boolean
   */
  async findUserByEmailPhone(email: string, phoneNo: string): Promise<boolean> {
    try {
      const user = await this.userRepo.find({
        where: [{ email }, { phoneNo }],
      });
      if (user) {
        return true;
      }
      return false;
    } catch (error) {
      Logger.error(
        `Error in findUserByEmailPhone of user service where credentials: ${JSON.stringify({
          email,
          phoneNo,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find user by means of id which is not active
   *
   * @param id
   * @returns user | null
   */
  async findOneById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id,
          status: UserStatus.ACTIVE,
        },
        relations: {
          userRoles: {
            role: {
              permission: true,
            },
          },
          userGroups: {
            group: {
              permission: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      // add user permissions to user object
      const userRoles: UserRoleEntity[] = user.userRoles;
      const userGroups: UserGroupEntity[] = user.userGroups;
      user['permissions'] = this.permissionService.mergePermissions(userRoles, userGroups);
      return user;
    } catch (error) {
      Logger.error(`Error in findOneById of user service where id: ${id}`);
      throw error;
    }
  }

  /**
   * This function is used to find and return user by email address.
   *
   * @param email
   * @param isPasswordRequired if this is true it will also returns user password
   * @returns User
   */
  async findUserByEmail(email: string, isPasswordRequired?: boolean): Promise<UserEntity> {
    try {
      const query = this.userRepo
        .createQueryBuilder('users')
        .where({ email })
        .leftJoinAndSelect('users.userRoles', 'userRoles', 'userRoles.isDeleted = false')
        .leftJoinAndSelect('userRoles.role', 'role')
        .leftJoinAndSelect('role.permission', 'permission')
        .leftJoinAndSelect('users.userGroups', 'userGroups', 'userGroups.isDeleted = false')
        .leftJoinAndSelect('userGroups.group', 'group')
        .leftJoinAndSelect('group.permission', 'groupPermission');
      if (isPasswordRequired) {
        query.addSelect(['users.password']);
      }
      return await query.getOne();
    } catch (error) {
      Logger.error(
        `Error in findUserByEmail of user service where credentials: ${JSON.stringify({
          email,
          isPasswordRequired,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find all users which are not deleted and also searched users
   *
   * @returns User[]
   */
  async findAll(
    options: FindOptionsWhere<UserEntity>,
    take: number,
    pageNo: number,
    searchText?: string,
    groupId?: string,
  ): Promise<[UserEntity[], number]> {
    try {
      // calculate skip
      // TODO: One edge case needs to be handle, when user in on second page or above and search then it  will have skip 10+ and it will not return any thing probably
      const skip = (pageNo - 1) * take;
      const query = this.userRepo
        .createQueryBuilder('users')
        .where(options)
        .leftJoinAndSelect('users.userRoles', 'userRoles', 'userRoles.isDeleted = false')
        .leftJoinAndSelect('userRoles.role', 'role')
        .leftJoinAndSelect('users.userGroups', 'userGroups', 'userGroups.isDeleted = false')
        .leftJoinAndSelect('userGroups.group', 'group');
      if (searchText) {
        query
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere('users.firstName ~* :searchText')
                .orWhere('users.lastName ~* :searchText')
                .orWhere('users.email ~* :searchText')
                .orWhere(`users.firstName || ' ' || users.lastName ~* :searchText`);
            }),
          )
          .setParameter('searchText', `(${searchText})`);
      }
      if (groupId) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('group.id = :groupId', { groupId });
          }),
        );
      }
      query.take(take).skip(skip);
      return await query.getManyAndCount();
    } catch (error) {
      Logger.error(`Error in findAll of user service where options: ${JSON.stringify(options)}`);
      throw error;
    }
  }

  async findAllNotInGroup(
    options: FindOptionsWhere<UserEntity>,
    take: number,
    pageNo: number,
    groupId: string,
    searchText?: string,
  ): Promise<[UserEntity[], number]> {
    try {
      // calculate skip
      const skip = (pageNo - 1) * take;
      const query = this.userRepo
        .createQueryBuilder('users')
        .where(options)
        .leftJoinAndSelect('users.userRoles', 'userRoles', 'userRoles.isDeleted = false')
        .leftJoinAndSelect('userRoles.role', 'role')
        .leftJoinAndSelect(
          'users.userGroups',
          'userGroups',
          'userGroups.groupId = :groupId AND userGroups.isDeleted = false',
        )
        .where('userGroups.userId IS NULL AND users.status != :userStatus', {
          userStatus: 'deleted',
        })
        .leftJoinAndSelect('userGroups.group', 'group')
        .setParameter('groupId', `${groupId}`);
      if (searchText) {
        query
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere('users.firstName ~* :searchText')
                .orWhere('users.lastName ~* :searchText')
                .orWhere('users.email ~* :searchText')
                .orWhere(`users.firstName || ' ' || users.lastName ~* :searchText`);
            }),
          )
          .setParameter('searchText', `(${searchText})`);
      }
      query.take(take).skip(skip);
      return await query.getManyAndCount();
    } catch (error) {
      Logger.error(`Error in findAll of user service where options: ${JSON.stringify(options)}`);
      throw error;
    }
  }

  /**
   * This function is used to update single user.
   *
   * @param param0
   * returns users
   */
  async updateSingleUser(
    options: FindOptionsWhere<UserEntity>,
    data: Partial<UserEntity>,
  ): Promise<UserEntity> {
    try {
      const user = await this.findOneByOptions(options);
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      } else {
        await this.userRepo.update({ id: user.id }, data);
        const updatedUser = await this.findOneByOptionsAndRelations(
          { id: user.id },
          {
            userRoles: {
              role: {
                permission: true,
              },
            },
            userGroups: {
              group: {
                permission: true,
              },
            },
          },
        );
        // add user permissions to user object
        const userRoles: UserRoleEntity[] = updatedUser.userRoles;
        const userGroups: UserGroupEntity[] = updatedUser.userGroups;
        updatedUser['permissions'] = this.permissionService.mergePermissions(userRoles, userGroups);
        return updatedUser;
      }
    } catch (error) {
      Logger.error(
        `Error in update of user service where options: ${JSON.stringify(
          options,
        )} and data: ${JSON.stringify(data)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find one user on the basis of options
   *
   * @param options
   * @returns User
   */
  async findOneByOptions(options: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    try {
      return this.userRepo.findOne({ where: options });
    } catch (error) {
      Logger.error(
        `Error in findOneByOptions of user service where options: ${JSON.stringify(options)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to create user with invite, send email and return user
   *
   * @param createUserDto
   * @param currentUser
   * @returns User
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, phoneNo, roleId, message, firstName, lastName } = createUserDto;
    // fetch user
    const userDb = await this.userRepo.findOne({ where: [{ email }, { phoneNo }] });
    if (userDb) {
      throw new ConflictError(ERRORS.USER_ALREADY_EXISTS);
    }
    // fetch role
    const roleData = await this.roleService.findOneByOptions({ isDeleted: false, id: roleId });
    if (!roleData) {
      throw new NotFoundError(ERRORS.RESOURCE_NOT_FOUND);
    }
    const user = await this.createUserInDb({ email, phoneNo, roleId, firstName, lastName });
    // send email
    this.emailService.sendEmail(
      email,
      EMAIL_SUBJECTS.NEW_USER_CREATE,
      EMAIL_TEMPLATES.NEW_USER_EMAIL_TEMPLATE,
      { recipientName: user.firstName, message },
    );
    return user;
  }

  /**
   * This function is used to create user
   *
   * @param param0
   * @returns User
   */
  async createUserInDb(data: CreateUser): Promise<UserEntity> {
    try {
      const { roleId, ...rest } = data;
      // create user
      const newUserInstance = this.userRepo.create(rest);
      const newUser = await this.userRepo.save(newUserInstance);

      // add role in middle table
      await this.userRolesService.create({ userId: newUser.id, roleId });
      return newUser;
    } catch (error) {
      Logger.error(
        `Error in createUser of user service where credentials: ${JSON.stringify(data)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to archive user
   *
   * @param id
   * @returns UpdateResult
   */
  async archiveUser(id: string): Promise<UpdateResult> {
    try {
      await this.userRepo.update({ id }, { status: UserStatus.DELETED });
      // update middle tables
      await this.userRolesService.archiveUserRole({ userId: id });
      return this.userGroupsService.archiveUserGroup({ userId: id });
    } catch (error) {
      Logger.error(`Error in archiveUser of user service where id: ${id}`);
      throw error;
    }
  }

  /**
   * This function is used to update single user.
   *
   * @param param0
   * returns users
   */
  async updateOtherUser(
    options: FindOptionsWhere<UserEntity>,
    data: UpdateOtherUserDto,
  ): Promise<UserEntity> {
    try {
      const { roles, ...rest } = data;
      const user = await this.findOneByOptions(options);
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      if (roles) {
        // fetch roles
        const rolesDb = await this.roleService.find({ name: In(roles), isDeleted: false });
        if (rolesDb.length !== roles.length) {
          throw new NotFoundError(ERRORS.RESOURCE_NOT_FOUND);
        }
        // update user roles
        await this.updateRoles(rolesDb, user.id);
      }
      await this.userRepo.update({ id: user.id }, rest);
      return this.findOneByOptionsAndRelations(
        { id: user.id },
        {
          userRoles: {
            role: {
              permission: true,
            },
          },
          userGroups: {
            group: {
              permission: true,
            },
          },
        },
      );
    } catch (error) {
      Logger.error(
        `Error in update of user service where options: ${JSON.stringify(
          options,
        )} and data: ${JSON.stringify(data)}`,
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
  async updateRoles(roles: RoleEntity[], userId: string): Promise<void> {
    try {
      // Get user's previous roles ids
      const userRoles = await this.userRolesService.find({ userId });

      // Extract previous role ids
      const previousRoleIds = userRoles.map((userRole) => userRole.roleId);

      // Extract current role ids
      const currentRoleIds = roles.map((role) => role.id);

      // Find roles to delete
      const rolesToDelete = previousRoleIds.filter((roleId) => !currentRoleIds.includes(roleId));

      // Find roles to add
      const rolesToAdd = currentRoleIds.filter((roleId) => !previousRoleIds.includes(roleId));

      // Delete roles that need to be deleted
      // TODO: update in bulk
      for (const roleId of rolesToDelete) {
        await this.userRolesService.archiveUserRole({ userId, roleId });
      }

      // Add roles that need to be added
      // TODO: update in bulk
      for (const roleId of rolesToAdd) {
        await this.userRolesService.create({ userId, roleId });
      }
    } catch (error) {
      Logger.error(`Error in updateRoles of user service where userId: ${userId}`);
      throw error;
    }
  }

  /**
   * This function is used to find one user on the basis of options and relations
   *
   * @param options
   * @param relations
   * @returns UserEntity
   */
  async findOneByOptionsAndRelations(
    options: FindOptionsWhere<UserEntity>,
    relations: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity> {
    try {
      return this.userRepo.findOne({ where: options, relations });
    } catch (error) {
      Logger.error(
        `Error in findOneByOptionsAndRelations of user service where options: ${JSON.stringify(
          options,
        )} and relations: ${JSON.stringify(relations)}`,
      );
      throw error;
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
    currentUserId: string,
  ): Promise<boolean> {
    try {
      if (id !== currentUserId) {
        throw new UnauthroizedError(ERRORS.UN_AUTHORIZED);
      }
      // fetch user old password
      const user = await this.userRepo.findOne({ where: { id }, select: { password: true } });
      const isOldPasswordSame = Utils.verifyPassword(user.password, updatePasswordDto.oldPassword);
      if (!isOldPasswordSame) {
        throw new BadRequestError(ERRORS.PASSWORD_MISMATCHED);
      }
      await this.updateSingleUser({ id }, { password: updatePasswordDto.newPassword });
      return true;
    } catch (error) {
      Logger.error(
        `Error in updatePassword of user service where id: ${id} and current User id: ${currentUserId}`,
      );
      throw error;
    }
  }
}
