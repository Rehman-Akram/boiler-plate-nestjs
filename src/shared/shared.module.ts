import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { TemplateService } from './template.service';
import { AwsS3Service } from './awsS3.service';
import { SharedService } from './shared.service';

@Module({
  providers: [EmailService, TemplateService, AwsS3Service, SharedService],
  exports: [EmailService, AwsS3Service, SharedService],
})
export class SharedModule {}
