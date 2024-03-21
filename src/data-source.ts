import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
};
export const dataSourceMigrations: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  seeds: ['src/seeders/*.seeder.ts'],
};

export const dataSource = new DataSource(dataSourceMigrations);
