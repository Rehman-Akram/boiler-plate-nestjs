import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseFormat } from '../shared/shared.interface';
import { ResponseFormatService } from '../shared/response-format.service';
import { MESSAGES } from '../shared/constants/constants';
import { UserWithToken } from './dto/user-with-token.dto';
import { UserEntity } from '../users/entities/user.entity';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginUser: LoginUserDto): Promise<ResponseFormat<UserWithToken>> {
    const userWithToken = await this.authService.loginUser(loginUser);
    return ResponseFormatService.responseOk<UserWithToken>(
      userWithToken,
      MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
    );
  }

  @ApiBearerAuth()
  @Get('who-am-i')
  async whoAmI(@CurrentUser() currentUser: UserEntity): Promise<ResponseFormat<UserEntity>> {
    return ResponseFormatService.responseOk<UserEntity>(currentUser, MESSAGES.QUERY_SUCCESS);
  }
}
