import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { MESSAGES, PERMISSIONS } from '../shared/constants/constants';
import { ResponseFormat } from '../shared/shared.interface';
import { GroupEntity } from './entities/group.entity';
import { ResponseFormatService } from '../shared/response-format.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateResult } from 'typeorm';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @SetMetadata('permissions', [{ [PERMISSIONS.ROLES]: { read: true } }])
  @Get()
  async findGroups(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('pageNo', ParseIntPipe) pageNo: number = 1,
    @Query('searchText') searchText?: string,
    @Query('isDeleted') isDeleted?: string,
  ): Promise<ResponseFormat<{ groups: GroupEntity[]; totalCount: number }>> {
    const isDeletedQuery: boolean = isDeleted === 'true' ? true : false;
    const [groups, totalCount] = await this.groupsService.findAll(
      { isDeleted: isDeletedQuery },
      take,
      pageNo,
      searchText,
    );
    return ResponseFormatService.responseOk<{ groups: GroupEntity[]; totalCount: number }>(
      { groups, totalCount },
      MESSAGES.QUERY_SUCCESS,
    );
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.ROLES]: { create: true } }])
  @Post('create')
  async create(@Body() createGroupDto: CreateGroupDto): Promise<ResponseFormat<GroupEntity>> {
    const group = await this.groupsService.create(createGroupDto);
    return ResponseFormatService.responseOk<GroupEntity>(
      group,
      MESSAGES.RESOURCE_CREATED_SUCCESSFULLY,
    );
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.ROLES]: { delete: true } }])
  @Delete('archive/:id')
  async archive(@Param('id') id: string): Promise<ResponseFormat<UpdateResult>> {
    const updateResult = await this.groupsService.archiveGroup(id);
    return ResponseFormatService.responseOk<UpdateResult>(updateResult, MESSAGES.QUERY_SUCCESS);
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.ROLES]: { update: true } }])
  @Patch('update/:id')
  async update(
    @Body() updateGroupDto: UpdateGroupDto,
    @Param('id') id: string,
  ): Promise<ResponseFormat<GroupEntity>> {
    const group = await this.groupsService.update(id, updateGroupDto);
    return ResponseFormatService.responseOk<GroupEntity>(
      group,
      MESSAGES.RESOURCE_CREATED_SUCCESSFULLY,
    );
  }

  @SetMetadata('permissions', [{ [PERMISSIONS.ROLES]: { read: true } }])
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseFormat<GroupEntity>> {
    const group = await this.groupsService.findGroupByIdWithActiveUsers(id);
    return ResponseFormatService.responseOk<GroupEntity>(group, MESSAGES.QUERY_SUCCESS);
  }
}
