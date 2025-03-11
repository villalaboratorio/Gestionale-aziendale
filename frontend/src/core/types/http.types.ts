export interface HttpRequestConfig {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
  }
  
  export interface HttpResponse<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
  }
  
  export interface IHttpClient {
    get<T>(url: string): Promise<HttpResponse<T>>;
    post<T>(url: string, data: unknown): Promise<HttpResponse<T>>;
    put<T>(url: string, data: unknown): Promise<HttpResponse<T>>;
    delete<T>(url: string): Promise<HttpResponse<T>>;
  }
  