export interface ResponseFormat<T> {
  statusCode: number;
  wasSuccess: boolean;
  message: string;
  response: T;
}
export interface AwsS3ConfigInterface {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  awsS3bucket: string;
}
export interface SignedUrlParamsInterface {
  fileName: string;
  contentType: string;
  s3Folder: string;
}
export interface SignedUrlPreviewParamsInterface {
  url: string;
}
export interface SignedUrlInterface {
  url: string;
  fileName: string;
  originalFileName: string;
}
export interface SignedUrlPreviewInterface {
  url: string;
  fileName: string;
}
