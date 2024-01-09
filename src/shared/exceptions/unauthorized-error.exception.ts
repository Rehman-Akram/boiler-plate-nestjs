import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ERRORS } from '../constants/constants';
import { UnauthroizedError } from '../errors';

@Catch(UnauthroizedError)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthroizedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      timestamp: new Date().toISOString(),
      message: exception.message || ERRORS.UN_AUTHORIZED,
    });
  }
}
