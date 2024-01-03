import { ValueTransformer } from 'typeorm';
import { Utils } from '../utils/utils';

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    if (value) {
      return Utils.generateHash(value);
    } else {
      return null;
    }
  }
  from(value) {
    return value;
  }
}
