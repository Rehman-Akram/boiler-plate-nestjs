import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRY_TIME, JWT_SECRET } from '../shared/constants/constants';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport-strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PermissionGuard } from './guards/permission.guard';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PermissionsModule,
    FilesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(ACCESS_TOKEN_EXPIRY_TIME),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, PermissionGuard],
  exports: [JwtAuthGuard, PermissionGuard, AuthService],
})
export class AuthModule {}
