import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import {
  BadRequestExceptionFilter,
  ConflictExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
} from './shared/exceptions';
import { AuthModule } from './auth/auth.module';

const globalFilters = [
  ConflictExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
  PasswordMismatchExceptionFilter,
  UnauthorizedExceptionFilter,
].map((filter) => ({
  provide: APP_FILTER,
  useClass: filter,
}));
@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      ...dataSourceOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      cache: true,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ...globalFilters,
  ],
})
export class AppModule {}
