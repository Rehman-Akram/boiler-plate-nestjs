import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { UserStatus } from '../enums/status.enum';
import { PasswordTransformer, TrimLowerTransformer } from '../../shared/transformers';
import { ApiProperty } from '@nestjs/swagger';
import { TrimTransformer } from '../../shared/transformers/trim.transformer';
import { UserGender } from '../enums/gender.enum';
import { UserRoleEntity } from '../../users-roles/entities/users-role.entity';
import { UserGroupEntity } from '../../users-groups/entities/users-group.entity';

@Entity('users')
@Index(['email', 'status', 'id'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ transformer: new TrimTransformer() })
  firstName: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true, transformer: new TrimTransformer() })
  lastName: string;

  @ApiProperty({ uniqueItems: true })
  @Column({ unique: true, transformer: new TrimLowerTransformer() })
  email: string;

  @ApiProperty({ enum: UserStatus, default: UserStatus.PENDING, required: false })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @ApiProperty({ required: false, enum: UserGender })
  @Column({ nullable: true, enum: UserGender })
  gender: UserGender;

  @ApiProperty({ default: false, required: false })
  @Column({ default: false })
  emailVerified: boolean;

  @ApiProperty({ maxLength: 100, required: false })
  @Column({
    length: 100,
    select: false,
    transformer: new PasswordTransformer(),
    nullable: true,
  })
  password: string;

  @ApiProperty({ required: false, uniqueItems: true })
  @Column({ unique: true, nullable: true })
  phoneNo: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  dateOfBirth: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ default: false, required: false })
  @Column({ default: false })
  phoneVerified: boolean;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];

  @OneToMany(() => UserGroupEntity, (userGroup) => userGroup.user)
  userGroups: UserGroupEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
