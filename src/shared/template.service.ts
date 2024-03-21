import { Injectable, Logger } from '@nestjs/common';
import { newUserEmailTemplate } from './templates/newUserEmailTemplate';

@Injectable()
export class TemplateService {
  // This is template name
  newUserEmailTemplate(recipientName: string, message: string): string {
    try {
      return newUserEmailTemplate(recipientName, message);
    } catch (error) {
      Logger.error(
        `Error in newUserEmailTemplate of template service where recipientName: ${recipientName} and message: ${message}`,
      );
      throw error;
    }
  }
}
