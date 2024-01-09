import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseFormat } from './shared.interface';

@Injectable()
export class ResponseFormatService {
  static responseOk<T>(data: T, message: string): ResponseFormat<T> {
    return {
      statusCode: HttpStatus.OK,
      wasSuccess: true,
      message: message,
      response: data,
    };
  }
}
