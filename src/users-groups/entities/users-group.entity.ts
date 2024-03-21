import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { GroupEntity } from '../../groups/entities/group.entity';

@Entity('usersGroups')
@Index(['id'])
export class UserGroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userGroups)
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => GroupEntity, (group) => group.groupUsers)
  group: GroupEntity;

  @Column()
  groupId: string;

  @ApiProperty({ default: false, required: false })
  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
