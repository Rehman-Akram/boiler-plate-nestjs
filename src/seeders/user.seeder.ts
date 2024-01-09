import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { usersData } from '../users/seeds/seed-data';
import { Logger } from '@nestjs/common';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const usersRepository = dataSource.getRepository(UserEntity);
      // add USERS from users data in users/seeds/seed-data.ts
      for (const user of usersData) {
        const isExistingUser = await usersRepository.findOne({
          where: { email: user.email, phoneNumber: user.phoneNumber },
        });
        if (!isExistingUser) {
          const userObj = usersRepository.create(user);
          await usersRepository.save(userObj);
          console.log('>>>>>>>>>>>>>>>>USERS CREATED SUCCESSFULLY>>>>>>>>>>>>>>>>>>');
        }
      }
    } catch (error) {
      Logger.error(`Error in UserSeeder`);
      throw error;
    }
  }
}
