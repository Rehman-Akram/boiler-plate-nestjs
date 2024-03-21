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
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('usersRoles')
@Index(['id'])
export class UserRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => RoleEntity, (role) => role.roleUsers)
  role: RoleEntity;

  @Column()
  roleId: string;

  @ApiProperty({ default: false, required: false })
  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
