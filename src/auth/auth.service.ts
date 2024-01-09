import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import {
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRY_TIME_IN_HOURS,
  ERRORS,
} from 'src/shared/constants/constants';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithToken } from './dto/user-with-token.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './auth.interface';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { ConflictError, NotFoundError, PasswordMismatchError } from '../shared/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * This function is used to create new user if user not exists. Otherwise it will throw conflict exception.
   *
   * @param createUser of CreateUserDto Type
   * @returns User
   */
  async createUser(createUser: CreateUserDto): Promise<UserEntity> {
    try {
      // check if user with email or phone already exists
      const existingUser = await this.userService.findUserByEmailPhone(
        createUser.email,
        createUser.phoneNumber,
      );
      if (existingUser) {
        throw new ConflictError(ERRORS.USER_ALREADY_EXISTS);
      }
      // create user
      return this.userService.create(createUser);
    } catch (error) {
      Logger.error(
        `Error in createUser of AuthService where createUserDto: ${JSON.stringify(createUser)}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to get user logged in if credentials are valid
   *
   * @param {email, passoword}
   * @returns user and access_token
   */
  async loginUser({ email, password }: LoginUserDto): Promise<UserWithToken> {
    try {
      // check if user exists with provided credentials
      const user = await this.checkUserForLogin(email, password);

      // generate token
      const token = this.generateToken(
        { id: user.id },
        this.configService.get<string>(ACCESS_TOKEN_EXPIRY_TIME_IN_HOURS),
      );
      // response
      return { user, access_token: token };
    } catch (error) {
      Logger.error(
        `Error in loginUser of AuthService where login credentials are ${JSON.stringify({
          email,
          password,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to check while user provided credentials (email, password) are valid or not for login purpose.
   *
   * @param email
   * @param password
   * @returns User
   */
  async checkUserForLogin(email: string, password: string): Promise<UserEntity> {
    try {
      // get user by email along with password
      const user = await this.userService.findUserByEmail(email, true);
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      // verify password
      const isPasswordVerified = await this.verifyPassword(user.password, password);
      if (!isPasswordVerified) {
        throw new PasswordMismatchError(ERRORS.PASSWORD_MISMATCHED);
      }
      // return user without password
      delete user.password;
      return user;
    } catch (error) {
      Logger.error(
        `Error in checkUserForLogin of auth service where credentials are ${JSON.stringify({
          email,
          password,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to verify user password
   *
   * @param userPassword
   * @param passwordInput
   * @returns Boolean
   */
  async verifyPassword(userPassword: string, passwordInput: string): Promise<boolean> {
    return bcrypt.compareSync(passwordInput, userPassword);
  }

  /**
   * This function is used to generate token for user
   *
   * @param payload
   * @param expiresIn
   * @returns token
   */
  generateToken(payload: TokenPayload, expiresIn: string): string {
    const secretKey = this.configService.get<string>(JWT_SECRET);
    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
