import { ERRORS } from '../constants/constants';

export class NotFoundError extends Error {
  constructor(message: string = ERRORS.RESOURCE_NOT_FOUND) {
    super(message);
  }
}
