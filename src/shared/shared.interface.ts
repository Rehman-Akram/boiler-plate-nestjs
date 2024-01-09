export interface ResponseFormat<T> {
  statusCode: number;
  wasSuccess: boolean;
  message: string;
  response: T;
}
