import { ERRORS } from '../constants/constants';

export class ConflictError extends Error {
  constructor(message: string = ERRORS.RESOURCE_ALREADY_EXISTS) {
    super(message);
  }
}
