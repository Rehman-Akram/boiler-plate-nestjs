import { ERRORS } from '../constants/constants';

export class BadRequestError extends Error {
  constructor(message: string = ERRORS.BAD_REQUEST) {
    super(message);
  }
}
