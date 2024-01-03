import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * @returns {User}
 */
export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
