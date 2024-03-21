import { ValueTransformer } from 'typeorm';

export class TrimTransformer implements ValueTransformer {
  to(value) {
    if (value) {
      return value.trim();
    } else {
      return null;
    }
  }
  from(value) {
    return value;
  }
}
