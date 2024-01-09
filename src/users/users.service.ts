import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { NotFoundError } from '../shared/errors/not-found.error';
import { ERRORS } from '../shared/constants/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  /**
   * This function is used to save user in db
   *
   * @param user
   * @returns user
   */
  async create(user: CreateUserDto): Promise<UserEntity> {
    try {
      const userInstance = this.userRepo.create(user);
      return this.userRepo.save(userInstance);
    } catch (error) {
      Logger.error(`Error in create function of user service where user: ${JSON.stringify(user)} `);
      throw error;
    }
  }

  /**
   * This function is used to find user if exist either by email or phoneNumber
   *
   * @param email
   * @param phoneNumber
   * @returns Boolean
   */
  async findUserByEmailPhone(email: string, phoneNumber: string): Promise<boolean> {
    try {
      const user = await this.userRepo.find({
        where: [{ email }, { phoneNumber }],
      });
      if (user) {
        return true;
      }
      return false;
    } catch (error) {
      Logger.error(
        `Error in findUserByEmailPhone of user service where credentials: ${JSON.stringify({
          email,
          phoneNumber,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find user by means of id which is not deleted
   *
   * @param id
   * @returns user | null
   */
  async findOneById(id: string): Promise<UserEntity | null> {
    try {
      return await this.userRepo.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });
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
      const query = this.userRepo.createQueryBuilder('user').where(email);
      if (isPasswordRequired) {
        query.addSelect(['user.password']);
      }
      return query.getOne();
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
   * This function is used to update user
   *
   * @param id
   * @param data
   * @returns updateResult
   */
  async update(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      } else {
        return this.userRepo.update(id, data);
      }
    } catch (error) {
      Logger.error(
        `Error in update of user service where id: ${id} and data: ${JSON.stringify(data)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to find all users which are not deleted
   *
   * @returns User[]
   */
  async findAll(): Promise<UserEntity[]> {
    return this.userRepo.find({ where: { isDeleted: false } });
  }
}
