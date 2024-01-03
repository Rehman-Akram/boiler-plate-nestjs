import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from '../auth.interface';
import { Reflector } from '@nestjs/core';
import { ERRORS } from 'src/shared/constants/constants';
import { NotFoundError, UnauthroizedError } from 'src/shared/errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {
    super(); // This is required to call the constructor of parent class where authentication is being done.
  }

  async canActivate(context: ExecutionContext) {
    try {
      // checking if route is public
      const isPublic = this.reflector.get<string>('isPublic', context.getHandler());
      if (isPublic) {
        return true;
      }
      // if route is not public
      const tokenUser: TokenPayload = context.switchToHttp().getRequest().user;
      if (!tokenUser) {
        throw new UnauthroizedError(ERRORS.INVALID_TOKEN);
      }
      const user = await this.userService.findOneById(tokenUser.id);
      if (!user) {
        throw new NotFoundError(ERRORS.INVALID_TOKEN);
      }
      // updating request with complete user object
      context.switchToHttp().getRequest().user = user;
      return true;
    } catch (error) {
      Logger.error('Error in canActivate of JwtAuthGuard');
      console.log(error);
      throw error;
    }
  }
}
