import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TrimTransformer } from '../../shared/transformers/trim.transformer';
import { UserGroupEntity } from '../../users-groups/entities/users-group.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('groups')
@Index(['id'])
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ uniqueItems: true })
  @Column({ transformer: new TrimTransformer(), unique: true })
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ default: false, required: false })
  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => UserGroupEntity, (groupUser) => groupUser.group)
  groupUsers: UserGroupEntity[];

  @OneToOne(() => PermissionEntity, (permission) => permission.role, { eager: true, cascade: true })
  @JoinColumn()
  permission: PermissionEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
