import { UserEntity } from './entities/user.entity';

export interface CreateUser extends Partial<UserEntity> {
  roleId: string;
}
