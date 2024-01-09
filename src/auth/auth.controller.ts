import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserWithToken } from './dto/user-with-token.dto';
import { ResponseFormat } from '../shared/shared.interface';
import { ResponseFormatService } from '../shared/response-format.service';
import { UserEntity } from '../users/entities/user.entity';
import { MESSAGES } from '../shared/constants/constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() createUser: CreateUserDto): Promise<ResponseFormat<UserEntity>> {
    const user = await this.authService.createUser(createUser);
    return ResponseFormatService.responseOk<UserEntity>(user, MESSAGES.USER_CREATED_SUCCESSFULLY);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUser: LoginUserDto): Promise<ResponseFormat<UserWithToken>> {
    const userWithToken = await this.authService.loginUser(loginUser);
    return ResponseFormatService.responseOk<UserWithToken>(
      userWithToken,
      MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
    );
  }
}
