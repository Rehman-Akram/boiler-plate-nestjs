import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BadRequestError } from '../errors/bad-request.error';
import { ERRORS } from '../constants/constants';

@Catch(BadRequestError)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      message: exception.message || ERRORS.BAD_REQUEST,
    });
  }
}
