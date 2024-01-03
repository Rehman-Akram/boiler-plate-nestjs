import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserStatus } from '../enums/user.enum';
import { PasswordTransformer, TrimLowerTransformer } from 'src/shared/transformers';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
@Index(['email', 'status', 'id'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  middleName: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({ uniqueItems: true })
  @Column({ length: 50, unique: true, transformer: new TrimLowerTransformer() })
  email: string;

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVE })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.ADMIN],
  })
  roles: UserRole[];

  @ApiProperty({ default: false, required: false })
  @Column({ default: false })
  emailVerified: boolean;

  @ApiProperty({ maxLength: 100 })
  @Column({
    length: 100,
    select: false,
    transformer: new PasswordTransformer(),
  })
  password: string;

  @ApiProperty({ required: false, uniqueItems: true })
  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @ApiProperty({ default: false })
  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
}
