import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig, ApiEndpoint, ApiResponse } from '../types';

/**
 * ApiBridge - Gestisce la comunicazione effettiva con il backend
 * mantenendo un'interfaccia compatibile con l'ApiService esistente
 */
export class ApiBridge {
  private httpClient: AxiosInstance;
  private baseURL: string;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL || 'http://localhost:5000';
    this.httpClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Esegue una richiesta API basata sulla configurazione dell'endpoint e sui dati
   */
  async executeRequest<T>(endpoint: ApiEndpoint, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const [processedPath, processedData] = this.processEndpointAndData(endpoint.path, data);
      
      let response: AxiosResponse;
      const config: AxiosRequestConfig = {};
      
      // Supporto per query params nelle richieste GET
      if (endpoint.method === 'GET' && processedData) {
        config.params = processedData;
      }
      
      switch (endpoint.method) {
        case 'GET':
          response = await this.httpClient.get<ApiResponse<T>>(processedPath, config);
          break;
        case 'POST':
          response = await this.httpClient.post<ApiResponse<T>>(processedPath, processedData);
          break;
        case 'PUT':
          response = await this.httpClient.put<ApiResponse<T>>(processedPath, processedData);
          break;
        case 'DELETE':
          response = await this.httpClient.delete<ApiResponse<T>>(processedPath, config);
          break;
        default:
          throw new Error(`Metodo HTTP non supportato: ${endpoint.method}`);
      }
      
      return this.standardizeResponse<T>(response);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Processa il path e i dati, gestendo i path parameters
   */
  private processEndpointAndData(path: string, data?: unknown): [string, unknown] {
    // Se non ci sono dati o il path non contiene parametri, restituisci inalterati
    if (!data || typeof data !== 'object' || !path.includes('{')) {
      return [path, data];
    }

    const clonedData = { ...(data as Record<string, unknown>) };
    
    // Sostituisci i parametri nel path
    const processedPath = path.replace(/{([^}]+)}/g, (match, key) => {
      if (clonedData[key] !== undefined) {
        const value = clonedData[key];
        delete clonedData[key]; // Rimuovi il parametro usato
        return encodeURIComponent(String(value));
      }
      return match;
    });

    // Restituisci i dati rimanenti solo se ce ne sono
    const remainingData = Object.keys(clonedData).length > 0 ? clonedData : undefined;
    
    return [processedPath, remainingData];
  }

  /**
   * Standardizza la risposta dal backend
   */
  private standardizeResponse<T>(response: AxiosResponse): ApiResponse<T> {
    // Verifica se la risposta è già nel formato ApiResponse
    if (response.data && ('success' in response.data)) {
      return response.data as ApiResponse<T>;
    }
    
    // Altrimenti, costruisci una risposta standard
    return {
      success: true,
      data: response.data,
      message: 'Success'
    };
  }

  /**
   * Gestisce gli errori in modo standardizzato
   */
  private handleError<T>(error: unknown): ApiResponse<T> {
    let errorMessage: string;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      errorMessage = axiosError.response?.data?.message || 'Server error';
    } else {
      errorMessage = String(error);
    }
    
    console.error('API Error:', errorMessage);
    
    // Include 'data' come null per rispettare l'interfaccia ApiResponse
    return {
      success: false,
      data: null as unknown as T, // Cast necessario per rispettare l'interfaccia
      message: errorMessage
    };
  }
}

// Factory per creare l'istanza di ApiBridge
let bridgeInstance: ApiBridge | null = null;

export const getApiBridge = (config: ApiConfig): ApiBridge => {
  if (!bridgeInstance) {
    bridgeInstance = new ApiBridge(config);
  }
  return bridgeInstance;
};
