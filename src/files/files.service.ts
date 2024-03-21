import { Injectable, Logger } from '@nestjs/common';
import { AwsS3Service } from '../shared/awsS3.service';
import { SignedUrlDto } from './dto/signed-url.dto';
import { PreviewSignedUrl, SignedUrl } from './files.interface';

@Injectable()
export class FilesService {
  constructor(private readonly awsS3Service: AwsS3Service) {}
  /**
   * This function is used to get signed url for further upload from frontend.
   *
   * @param '{fileName, contentType, s3Folder}'
   * @returns SignedUrl
   */
  getSignedUrl({ fileName, contentType, s3Folder }: SignedUrlDto): SignedUrl {
    try {
      return this.awsS3Service.getSignedUrl({ fileName, contentType, s3Folder });
    } catch (error) {
      Logger.error(
        `Error while getting signed url. Params are ${JSON.stringify({ fileName, contentType })}`,
      );
      throw error;
    }
  }

  /**
   * This function is used to get preview signed url.
   *
   * @param url
   * @returns preview signed url
   */
  async getPreviewSignedUrl(url: string): Promise<PreviewSignedUrl> {
    try {
      const signedUrl = await this.awsS3Service.getPreviewUrl({ url });
      return signedUrl;
    } catch (error) {
      Logger.error(`Error fetching signed url where provided url is : ${url}`);
      throw error;
    }
  }
}
