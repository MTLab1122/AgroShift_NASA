export interface ApiError {
  error_code: string;
  message: string;
  details?: any | null;
  request_id?: string | null;
}
