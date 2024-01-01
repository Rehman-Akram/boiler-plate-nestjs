import { join } from 'path';

export default () => {
  const databasePG = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    migrationsRun: true,
    autoLoadEntities: true,
    logging: true,
    migrations: [join(__dirname, '../migrations', '*{ts,js}')],
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  };
  return {
    PORT: parseInt(process.env.PORT, 10),
    databasePG,
    get(key: string): string {
      return process.env[key];
    },
  };
};
