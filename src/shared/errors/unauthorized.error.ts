import { ERRORS } from '../constants/constants';

export class UnauthroizedError extends Error {
  constructor(message: string = ERRORS.UN_AUTHORIZED) {
    super(message);
  }
}
