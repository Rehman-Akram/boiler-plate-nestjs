import { UserEntity } from '../../users/entities/user.entity';

export class UserWithToken {
  user: UserEntity;
  accessToken: string;
}
