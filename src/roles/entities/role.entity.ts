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
import { UserRoleEntity } from '../../users-roles/entities/users-role.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('roles')
@Index(['id'])
export class RoleEntity {
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

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  roleUsers: UserRoleEntity[];

  @OneToOne(() => PermissionEntity, (permission) => permission.role, { eager: true, cascade: true })
  @JoinColumn()
  permission: PermissionEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
