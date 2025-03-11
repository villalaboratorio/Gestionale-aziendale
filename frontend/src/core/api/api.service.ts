import { ApiConfig, ApiEndpoint, ApiResponse, ApiError } from '../types';
import { EventType } from '../types';
import { cacheManager } from '../Path/cache';
import { eventBus } from '../events';
import { getApiBridge } from './api.bridge';

export class ApiService {
  private static instance: ApiService;
  private config: ApiConfig;
  private apiBridge: ReturnType<typeof getApiBridge>; // Tipo più specifico

  private constructor(config: ApiConfig) {
    // Inizializza la configurazione con valori di default
    this.config = {
      baseURL: config.baseURL || 'http://localhost:5000',
      endpoints: { ...config.endpoints }
    };
    
    // Inizializza il bridge passando l'intera configurazione
    this.apiBridge = getApiBridge(this.config);
  }

  /**
   * Restituisce l'istanza singleton dell'ApiService.
   * Se l'istanza esiste già, unisce la nuova configurazione con quella esistente.
   */
  static getInstance(config: ApiConfig): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(config);
    } else if (config) {
      // Se l'istanza esiste ma viene fornita una nuova configurazione, 
      // aggiorna gli endpoint senza sovrascriverli
      ApiService.instance.updateConfig(config);
    }
    return ApiService.instance;
  }

  /**
   * Aggiorna la configurazione unendo gli endpoint invece di sovrascriverli
   */
  private updateConfig(config: ApiConfig): void {
    // Aggiorniamo il baseURL solo se fornito
    if (config.baseURL) {
      this.config.baseURL = config.baseURL;
    }
    
    // Uniamo gli endpoint invece di sovrascriverli
    if (config.endpoints) {
      this.config.endpoints = {
        ...this.config.endpoints,
        ...config.endpoints
      };
    }
    
    // Per debug, logghiamo quanti endpoint sono configurati
    console.log(`ApiService: configurati ${Object.keys(this.config.endpoints).length} endpoints`);
  }

  /**
   * Esegue una richiesta API utilizzando l'endpoint specificato
   */
  async request<T>(endpointKey: string, data?: unknown): Promise<ApiResponse<T>> {
    const endpoint = this.config.endpoints[endpointKey];
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointKey} not found`);
    }

    const cacheKey = this.getCacheKey(endpoint, data);
    if (endpoint.cacheable) {
      const cached = cacheManager.get<ApiResponse<T>>(cacheKey);
      if (cached) return cached;
    }

    try {
      // Utilizziamo ApiBridge per eseguire la richiesta
      const response = await this.apiBridge.executeRequest<T>(endpoint, data);
      
      if (endpoint.cacheable) {
        cacheManager.set(cacheKey, response, { ttl: 300000 });
      }

      return response;
    } catch (error) {
      this.handleError(error as ApiError, endpointKey);
      throw error;
    }
  }

  /**
   * Genera una chiave di cache unica basata sull'endpoint e sui dati
   */
  private getCacheKey(endpoint: ApiEndpoint, data?: unknown): string {
    return `${endpoint.method}:${endpoint.path}:${JSON.stringify(data || '')}`;
  }

  /**
   * Gestisce gli errori emettendo un evento
   */
  private handleError(error: ApiError, endpointKey: string): void {
    eventBus.emit('api:error', {
      endpoint: endpointKey,
      error,
      timestamp: Date.now()
    }, EventType.ERROR);
  }
}

/**
 * Factory function per creare un'istanza dell'ApiService
 */
export const createApiService = (config: ApiConfig): ApiService => ApiService.getInstance(config);
