import { IHttpClient, HttpRequestConfig, HttpResponse } from '../../types';
import { eventBus } from '../../events';
import { EventType } from '../../types';
import { cacheManager } from '../cache';

class HttpClient implements IHttpClient {
  private static instance: HttpClient;
  private config: HttpRequestConfig;

  private constructor(config: HttpRequestConfig = {}) {
    this.config = {
      baseURL: '',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000,
      withCredentials: false,
      ...config
    };
  }

  static getInstance(config?: HttpRequestConfig): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient(config);
    }
    return HttpClient.instance;
  }

  async get<T>(url: string): Promise<HttpResponse<T>> {
    const cacheKey = `get:${url}`;
    const cached = cacheManager.get<HttpResponse<T>>(cacheKey);
    if (cached) return cached;

    const response = await fetch(this.getFullUrl(url), {
      method: 'GET',
      headers: this.config.headers,
      credentials: this.config.withCredentials ? 'include' : 'same-origin'
    });

    const result = await this.handleResponse<T>(response);
    cacheManager.set(cacheKey, result, { ttl: 300000 }); // 5 min cache
    return result;
  }

  async post<T>(url: string, data: unknown): Promise<HttpResponse<T>> {
    const response = await fetch(this.getFullUrl(url), {
      method: 'POST',
      headers: this.config.headers,
      credentials: this.config.withCredentials ? 'include' : 'same-origin',
      body: JSON.stringify(data)
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data: unknown): Promise<HttpResponse<T>> {
    const response = await fetch(this.getFullUrl(url), {
      method: 'PUT',
      headers: this.config.headers,
      credentials: this.config.withCredentials ? 'include' : 'same-origin',
      body: JSON.stringify(data)
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string): Promise<HttpResponse<T>> {
    const response = await fetch(this.getFullUrl(url), {
      method: 'DELETE',
      headers: this.config.headers,
      credentials: this.config.withCredentials ? 'include' : 'same-origin'
    });

    return this.handleResponse<T>(response);
  }

  private getFullUrl(url: string): string {
    return `${this.config.baseURL}${url}`;
  }

  private async handleResponse<T>(response: Response): Promise<HttpResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      eventBus.emit('http:error', {
        url: response.url,
        status: response.status,
        data
      }, EventType.ERROR);
      
      throw new Error(data.message || 'HTTP Error');
    }

    // Conversione corretta dell'oggetto Headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      data,
      status: response.status,
      headers
    };
  }
}

export const httpClient = HttpClient.getInstance();
