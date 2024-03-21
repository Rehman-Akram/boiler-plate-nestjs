import { IsString } from 'class-validator';

export class SignedUrlDto {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsString()
  s3Folder: string;
}
