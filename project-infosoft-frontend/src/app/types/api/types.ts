export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }
  
  export interface ApiError {
    message: string;
    statusCode: number;
    errors?: string[];
  }