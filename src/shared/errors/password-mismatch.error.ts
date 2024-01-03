import { ERRORS } from '../constants/constants';

export class PasswordMismatchError extends Error {
  constructor(message: string = ERRORS.PASSWORD_MISMATCHED) {
    super(message);
  }
}
