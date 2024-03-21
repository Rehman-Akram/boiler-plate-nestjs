import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import {
  AwsS3ConfigInterface,
  SignedUrlInterface,
  SignedUrlParamsInterface,
  SignedUrlPreviewInterface,
  SignedUrlPreviewParamsInterface,
} from './shared.interface';
@Injectable()
export class AwsS3Service {
  private readonly s3: AWS.S3;
  awsS3Config: AwsS3ConfigInterface;

  constructor(public configService: ConfigService) {
    this.awsS3Config = this.configService.get('awsS3Config');
    const s3Options: AWS.S3.ClientConfiguration = {
      region: this.awsS3Config.region,
      credentials: {
        accessKeyId: this.awsS3Config.accessKeyId,
        secretAccessKey: this.awsS3Config.secretAccessKey,
      },
    };
    this.s3 = new AWS.S3(s3Options);
  }

  /**
   * This function is used to generate signed url for single file.
   *
   * @param '{fileName, contentType, s3Folder}'
   * @returns signed url
   */
  getSignedUrl({ fileName, contentType, s3Folder }: SignedUrlParamsInterface): SignedUrlInterface {
    try {
      const urlExpiryTime = 60 * 60;
      const originalFileName = fileName;
      fileName = new Date().getTime() + fileName;
      const myKey = s3Folder + fileName;
      const params = {
        Bucket: this.awsS3Config.awsS3bucket,
        Key: myKey,
        Expires: urlExpiryTime,
        ContentType: contentType,
      };
      const fileurl = this.s3.getSignedUrl('putObject', params);
      const configObject = {
        url: fileurl,
        fileName: fileName,
        originalFileName,
      };
      return configObject;
    } catch (error) {
      Logger.error(
        `Error in getSignedUrls of aws service where input: ${JSON.stringify({
          fileName,
          contentType,
          s3Folder,
        })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to generate signed url for preview of single file.
   *
   * @param '{url}'
   * @returns signed url for preview
   */
  async getPreviewUrl({
    url,
  }: SignedUrlPreviewParamsInterface): Promise<SignedUrlPreviewInterface> {
    try {
      const urlExpiryTime = 60 * 60;
      const urlParts = url.split('/');
      const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);
      const myKey = url.replace(/^.*\.com\//, '');
      const params = {
        Bucket: this.awsS3Config.awsS3bucket,
        Key: myKey,
        Expires: urlExpiryTime,
      };
      const fileurl = this.s3.getSignedUrl('getObject', params);
      const configObject = {
        url: fileurl,
        fileName: fileName,
      };
      return configObject;
    } catch (error) {
      Logger.error(`Error in getSignedUrls of aws service where input: ${JSON.stringify({ url })}`);
      throw error;
    }
  }
}
