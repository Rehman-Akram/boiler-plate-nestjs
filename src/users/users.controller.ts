import { Controller, Get, Body, Patch, Param, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { NotFoundError } from '../shared/errors/not-found.error';
import { ERRORS } from '../shared/constants/constants';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.usersService.update(id, updateUserDto);
    return await this.usersService.findOneById(id);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    try {
      const user = await this.usersService.findOneById(id);
      if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      Logger.error(`Error in findById of user controller where id: ${id}`);
      throw error;
    }
  }
}
