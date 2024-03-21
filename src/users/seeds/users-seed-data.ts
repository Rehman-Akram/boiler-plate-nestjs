import { ROLES } from '../../shared/constants/constants';
import { UserGender } from '../enums/gender.enum';
import { UserStatus } from '../enums/status.enum';

export const usersData = [
  {
    firstName: 'Rehman',
    lastName: 'Akram',
    status: UserStatus.ACTIVE,
    email: 'rehman.chughtai@focusteck.com',
    gender: UserGender.MALE,
    phoneNo: '+923334270732',
    password: 'Abcdef@123',
    emailVerified: true,
    phoneVerified: true,
    role: ROLES.SUPER_ADMIN,
  },
  {
    firstName: 'Bilal',
    lastName: 'Maan',
    status: UserStatus.ACTIVE,
    email: 'bilal.yunus@focusteck.com',
    gender: UserGender.MALE,
    phoneNo: '+923216358444',
    password: 'Abcdef@123',
    emailVerified: true,
    phoneVerified: true,
    role: ROLES.SUPER_ADMIN,
  },
];
