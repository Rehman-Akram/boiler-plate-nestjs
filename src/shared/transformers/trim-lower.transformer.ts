import { ValueTransformer } from 'typeorm';
import { Utils } from '../utils/utils';

export class TrimLowerTransformer implements ValueTransformer {
  to(value) {
    if (value) {
      return Utils.trimLowerString(value);
    } else {
      return null;
    }
  }
  from(value) {
    return value;
  }
}
