import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PasswordMismatchError } from '../errors/password-mismatch.error';
import { ERRORS } from '../constants/constants';

@Catch(PasswordMismatchError)
export class PasswordMismatchExceptionFilter implements ExceptionFilter {
  catch(exception: PasswordMismatchError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      message: exception.message || ERRORS.PASSWORD_MISMATCHED,
    });
  }
}
