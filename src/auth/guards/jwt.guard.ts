import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ERRORS } from '../../shared/constants/constants';
import { UnauthroizedError } from '../../shared/errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super(); // This is required as constructors for derived classed must conatin a super call
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // checking if route is public
      const isPublic = this.reflector.get<string>('isPublic', context.getHandler());
      if (isPublic) {
        return true;
      }
      // if route is not public
      const incomingRequest = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(incomingRequest);
      if (!token) {
        throw new UnauthroizedError(ERRORS.TOKEN_NOT_FOUND);
      }
      const isTokenValid = (await super.canActivate(context)) as boolean; // calling jwt strategy to validate token
      if (!isTokenValid) {
        throw new UnauthroizedError(ERRORS.INVALID_TOKEN);
      }
      return true;
    } catch (error) {
      Logger.error(`Error in canActivate of JwtAuthGuard`);
      throw error;
    }
  }
  /**
   * This function is used to extract authorization header from incoming request
   *
   * @param request
   * @returns
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers['authorization'] && request.headers['authorization'].split(' ')) ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
