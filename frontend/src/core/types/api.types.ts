export interface ApiEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    requiresAuth: boolean;
    cacheable: boolean;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp?: number;
  }
  
  export interface ApiConfig {
    baseURL: string;
    endpoints: Record<string, ApiEndpoint>;
    defaultHeaders?: Record<string, string>;
  }
  
  export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
  }
  