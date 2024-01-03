import { UserEntity } from 'src/users/entities/user.entity';

export class UserWithToken {
  user: UserEntity;
  access_token: string;
}
