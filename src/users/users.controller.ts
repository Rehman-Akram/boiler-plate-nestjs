import {
  Controller,
  Get,
  SetMetadata,
  Query,
  ParseIntPipe,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { MESSAGES, PERMISSIONS } from '../shared/constants/constants';
import { ResponseFormat } from 'src/shared/shared.interface';
import { ResponseFormatService } from 'src/shared/response-format.service';
import { Not, UpdateResult } from 'typeorm';
import { UserStatus } from './enums/status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateOtherUserDto } from './dto/update-other-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { read: true } }])
  @Get()
  async findAll(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('pageNo', ParseIntPipe) pageNo: number = 1,
    @Query('searchText') searchText?: string,
    @Query('groupId') groupId?: string,
  ): Promise<ResponseFormat<{ users: UserEntity[]; totalCount: number }>> {
    const [users, totalCount] = await this.usersService.findAll(
      { status: Not(UserStatus.DELETED) },
      take,
      pageNo,
      searchText,
      groupId,
    );
    return ResponseFormatService.responseOk<{ users; totalCount }>(
      { users, totalCount },
      MESSAGES.QUERY_SUCCESS,
    );
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { read: true } }])
  @Get('notInGroup')
  async findAllNotInGroup(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('pageNo', ParseIntPipe) pageNo: number = 1,
    @Query('groupId') groupId: string,
    @Query('searchText') searchText?: string,
  ): Promise<ResponseFormat<{ users: UserEntity[]; totalCount: number }>> {
    const [users, totalCount] = await this.usersService.findAllNotInGroup(
      { status: Not(UserStatus.DELETED) },
      take,
      pageNo,
      groupId,
      searchText,
    );
    return ResponseFormatService.responseOk<{ users; totalCount }>(
      { users, totalCount },
      MESSAGES.QUERY_SUCCESS,
    );
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { create: true } }])
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponseFormat<UserEntity>> {
    const user = await this.usersService.createUser(createUserDto);
    return ResponseFormatService.responseOk<UserEntity>(user, MESSAGES.USER_CREATED_SUCCESSFULLY);
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { update: true } }])
  @Patch('update/:id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<ResponseFormat<UserEntity>> {
    const user = await this.usersService.updateSingleUser({ id }, updateUserDto);
    return ResponseFormatService.responseOk<UserEntity>(user, MESSAGES.QUERY_SUCCESS);
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { delete: true } }])
  @Delete('archive/:id')
  async archiveUser(@Param('id') id: string): Promise<ResponseFormat<UpdateResult>> {
    const updatedResult = await this.usersService.archiveUser(id);
    return ResponseFormatService.responseOk<UpdateResult>(updatedResult, MESSAGES.QUERY_SUCCESS);
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { read: true } }])
  @Get(':id')
  async findUser(@Param('id') id: string): Promise<ResponseFormat<UserEntity>> {
    const user = await this.usersService.findOneById(id);
    return ResponseFormatService.responseOk<UserEntity>(user, MESSAGES.QUERY_SUCCESS);
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.USERS]: { update: true } }])
  @Patch('update-user/:id')
  async updateOtherUser(
    @Body() updateOtherUserDto: UpdateOtherUserDto,
    @Param('id') id: string,
  ): Promise<ResponseFormat<UserEntity>> {
    const user = await this.usersService.updateOtherUser({ id }, updateOtherUserDto);
    return ResponseFormatService.responseOk<UserEntity>(user, MESSAGES.QUERY_SUCCESS);
  }

  @Patch('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseFormat<boolean>> {
    const updatedRusult = await this.usersService.updatePassword(
      id,
      updatePasswordDto,
      currentUser.id,
    );
    return ResponseFormatService.responseOk(updatedRusult, MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY);
  }
}
