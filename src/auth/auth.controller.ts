import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithToken } from './dto/user-with-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return await this.authService.createUser(createUser);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUser: LoginUserDto): Promise<UserWithToken> {
    return await this.authService.loginUser(loginUser);
  }
}
