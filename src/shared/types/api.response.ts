export interface SuccessResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ErrorResponse {
  message: string;
  code: number;
  timestamp?: string;
  path?: string;
  method?: string;
  fields?: string[];
  stack?: string;
}
