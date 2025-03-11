import { ApiResponse } from '@core/types';
import { httpClient } from '../../../core/Path/http/http.client';
import { Lavorazione, Cottura, TipoCottura, InitialCollections } from '../types';

interface LavorazioneFilters {
  stato?: string;
  dataInizio?: string;
  dataFine?: string;
  ricetta?: string;
  operatore?: string;
}

interface ModificaPayload {
  campo: string;
  valore: string | number | boolean;
}

/**
 * LavorazioneService - Gestisce tutte le operazioni API relative alle lavorazioni
 */
export class LavorazioneService {
  private baseUrl = '/v2/lavorazioni';
  private cache: Map<string, { data: unknown, timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minuti di default
  private maxRetries = 2;

  /**
   * Recupera un elemento dalla cache se presente e non scaduto
   */
  private getFromCache<T>(key: string, ttl: number = this.cacheTTL): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > ttl) {
      // Cache scaduta
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Salva un elemento in cache
   */
  private setInCache<T>(key: string, data: T, ttl: number = this.cacheTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Imposta un timeout per rimuovere automaticamente dopo TTL
    setTimeout(() => {
      this.invalidateCache(key);
    }, ttl);
  }

  /**
   * Invalida una chiave specifica dalla cache
   */
  private invalidateCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida tutte le chiavi della cache che iniziano con un prefisso
   */
  private invalidateCacheByPrefix(prefix: string): void {
    Array.from(this.cache.keys()).forEach(key => {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Esegue una funzione con logica di retry automatico
   */
  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let attempts = 0;
    let lastError: unknown;
    
    while (attempts <= this.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts <= this.maxRetries) {
          // Attendi un po' prima di riprovare (con backoff esponenziale)
          const delay = Math.pow(2, attempts) * 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Se arriviamo qui, tutti i tentativi sono falliti
    throw lastError;
  }

  /**
   * Formatta un messaggio di errore in una risposta API standardizzata
   */
  private formatErrorResponse<T = unknown>(message: string): ApiResponse<T> {
    return {
      success: false,
      message,
      timestamp: Date.now(),
      data: null as unknown as T // Aggiungiamo data anche se è un errore
    };
  }

  /**
   * Recupera l'elenco delle lavorazioni per la dashboard con supporto per filtri e paginazione
   */
  async getDashboardLavorazioni(
    filters: LavorazioneFilters = {}, 
    page = 1, 
    pageSize = 10
  ): Promise<ApiResponse<Lavorazione[]>> {
    console.log('Fetching dashboard lavorazioni with filters:', filters);
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''))    });
    
    const cacheKey = `dashboard_${queryParams.toString()}`;
    
    try {
      // Controllo cache
      const cachedData = this.getFromCache<ApiResponse<Lavorazione[]>>(cacheKey);
      if (cachedData) {
        console.log('Returning cached dashboard data');
        return cachedData;
      }
      
      // Fetch dati con retry
      const response = await this.executeWithRetry(() => 
        httpClient.get<ApiResponse<Lavorazione[]>>(`${this.baseUrl}?${queryParams}`)
      );
      
      this.setInCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard lavorazioni:', error);
      return this.formatErrorResponse('Error fetching dashboard lavorazioni');
    }
  }

  /**
   * Recupera i dettagli di una specifica lavorazione
   */
  async getLavorazione(id: string, forceRefresh = false): Promise<ApiResponse<Lavorazione>> {
    console.log(`Fetching lavorazione with ID ${id}`);
    
    const cacheKey = `lavorazione_${id}`;
    
    try {
      // Controllo cache se non è richiesto un refresh forzato
      if (!forceRefresh) {
        const cachedData = this.getFromCache<ApiResponse<Lavorazione>>(cacheKey);
        if (cachedData) {
          console.log(`Returning cached data for lavorazione ${id}`);
          return cachedData;
        }
      }
      
      // Fetch dati con retry
      const response = await this.executeWithRetry(() => 
        httpClient.get<ApiResponse<Lavorazione>>(`${this.baseUrl}/${id}`)
      );
      
      console.log(`Successfully fetched lavorazione ${id}`);
      this.setInCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lavorazione ${id}:`, error);
      return this.formatErrorResponse(`Error fetching lavorazione with ID ${id}`);
    }
  }

  /**
   * Recupera le collezioni necessarie per il modulo lavorazioni
   */
  async getCollections(forceRefresh = false): Promise<ApiResponse<InitialCollections>> {
    console.log('Fetching collections for lavorazioni');
    
    const cacheKey = 'lavorazioni_collections';
    
    try {
      // Controllo cache se non è richiesto un refresh forzato
      if (!forceRefresh) {
        const cachedData = this.getFromCache<ApiResponse<InitialCollections>>(cacheKey, 30 * 60 * 1000); // 30 minuti per le collezioni
        if (cachedData) {
          console.log('Returning cached collections data');
          return cachedData;
        }
      }
      
      // Fetch dati con retry
      const response = await this.executeWithRetry(() => 
        httpClient.get<ApiResponse<InitialCollections>>(`${this.baseUrl}/initial-data`)
      );
      
      console.log('Successfully fetched collections');
      this.setInCache(cacheKey, response.data, 30 * 60 * 1000); // Cache per 30 minuti
      return response.data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      return this.formatErrorResponse('Error fetching collections');
    }
  }

  /**
   * Crea una nuova lavorazione
   */
  async createLavorazione(data: Partial<Lavorazione>): Promise<ApiResponse<Lavorazione>> {
    console.log('Creating new lavorazione:', data);
    
    try {
      const response = await this.executeWithRetry(() => 
        httpClient.post<ApiResponse<Lavorazione>>(this.baseUrl, data)
      );
      
      console.log('Successfully created lavorazione:', response.data);
      
      // Invalida la cache della dashboard quando viene creata una nuova lavorazione
      this.invalidateCacheByPrefix('dashboard_');
      
      return response.data;
    } catch (error) {
      console.error('Error creating lavorazione:', error);
      return this.formatErrorResponse('Error creating lavorazione');
    }
  }

  /**
   * Aggiorna una lavorazione esistente
   */
  async updateLavorazione(id: string, data: Partial<Lavorazione>): Promise<ApiResponse<Lavorazione>> {
    console.log(`Updating lavorazione ${id}:`, data);
    
    try {
      const response = await this.executeWithRetry(() => 
        httpClient.put<ApiResponse<Lavorazione>>(`${this.baseUrl}/${id}`, data)
      );
      
      console.log(`Successfully updated lavorazione ${id}`);
      
      // Aggiorna la cache sia per la lavorazione specifica che per la dashboard
      this.invalidateCache(`lavorazione_${id}`);
      this.invalidateCacheByPrefix('dashboard_');
      
      return response.data;
    } catch (error) {
      console.error(`Error updating lavorazione ${id}:`, error);
      return this.formatErrorResponse(`Error updating lavorazione with ID ${id}`);
    }
  }

  /**
   * Elimina una lavorazione esistente
   */
  async deleteLavorazione(id: string): Promise<ApiResponse<void>> {
    console.log(`Deleting lavorazione ${id}`);
    
    try {
      const response = await this.executeWithRetry(() => 
        httpClient.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      );
      
      console.log(`Successfully deleted lavorazione ${id}`);
      
      // Invalida la cache per la lavorazione eliminata e la dashboard
      this.invalidateCache(`lavorazione_${id}`);
      this.invalidateCacheByPrefix('dashboard_');
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting lavorazione ${id}:`, error);
      return this.formatErrorResponse(`Error deleting lavorazione with ID ${id}`);
    }
  }

  /**
   * Salva una modifica specifica di un campo in una lavorazione
   */
  async saveModifica(
    id: string, 
    campo: string, 
    valore: ModificaPayload['valore']
  ): Promise<ApiResponse<void>> {
    console.log(`Saving modifica for lavorazione ${id}, campo: ${campo}, valore:`, valore);
    
    try {
      const response = await this.executeWithRetry(() => 
        httpClient.put<ApiResponse<void>>(`${this.baseUrl}/${id}/modifica`, {
          campo,
          valore
        })
      );
      
      // Invalida la cache per la lavorazione modificata
      this.invalidateCache(`lavorazione_${id}`);
      
      return response.data;
    } catch (error) {
      console.error(`Error saving modifica for lavorazione ${id}:`, error);
      return this.formatErrorResponse(`Error saving modifica for lavorazione with ID ${id}`);
    }
  }

  /**
   * Recupera i tipi di cottura disponibili
   */
  async getTipiCottura(): Promise<ApiResponse<TipoCottura[]>> {
    console.log('Fetching tipi cottura');
    
    const cacheKey = 'tipi_cottura';
    
    try {
      const cachedData = this.getFromCache<ApiResponse<TipoCottura[]>>(cacheKey, 60 * 60 * 1000); // 1 ora
      if (cachedData) {
        return cachedData;
      }
      
      const response = await this.executeWithRetry(() => 
        httpClient.get<ApiResponse<TipoCottura[]>>('/api/tipo-cotture/v2/list')
      );
      
      this.setInCache(cacheKey, response.data, 60 * 60 * 1000); // 1 ora
      return response.data;
    } catch (error) {
      console.error('Error fetching tipi cottura:', error);
      return this.formatErrorResponse('Error fetching tipi cottura');
    }
  }

  /**
   * Recupera le cotture associate a una lavorazione
   */
  async getCotture(lavorazioneId: string): Promise<ApiResponse<Cottura[]>> {
    console.log(`Fetching cotture for lavorazione ${lavorazioneId}`);
    
    const cacheKey = `cotture_${lavorazioneId}`;
    
    try {
      const cachedData = this.getFromCache<ApiResponse<Cottura[]>>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const response = await this.executeWithRetry(() => 
        httpClient.get<ApiResponse<Cottura[]>>(`${this.baseUrl}/${lavorazioneId}/cotture`)
      );
      
      this.setInCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cotture for lavorazione ${lavorazioneId}:`, error);
      return this.formatErrorResponse(`Error fetching cotture for lavorazione with ID ${lavorazioneId}`);
    }
  }

  /**
   * Aggiorna una cottura specifica
   */
  async updateCottura(
    lavorazioneId: string,
    cotturaId: string,
    data: Partial<Cottura>
  ): Promise<ApiResponse<Cottura>> {
    console.log(`Updating cottura ${cotturaId} for lavorazione ${lavorazioneId}:`, data);
    
    try {
      const response = await this.executeWithRetry(() => 
        httpClient.put<ApiResponse<Cottura>>(
          `${this.baseUrl}/${lavorazioneId}/cotture/${cotturaId}`,
          data
        )
      );
      
      // Invalida le cache correlate
      this.invalidateCache(`cotture_${lavorazioneId}`);
      this.invalidateCache(`lavorazione_${lavorazioneId}`);
      
      return response.data;
    } catch (error) {
      console.error(`Error updating cottura ${cotturaId}:`, error);
      return this.formatErrorResponse(`Error updating cottura with ID ${cotturaId}`);
    }
  }

  /**
   * Registra una temperatura per una cottura
   */
  async registerTemperatura(
    lavorazioneId: string, 
    cotturaId: string,
    datiTemperatura: { temperatura: number }
  ): Promise<ApiResponse<void>> {
    console.log(`Registering temperatura for cottura ${cotturaId}:`, datiTemperatura);
    
    try {
      const response = await this.executeWithRetry(() => 
        httpClient.post<ApiResponse<void>>(
          `${this.baseUrl}/${lavorazioneId}/cotture/${cotturaId}/temperatura`,
          datiTemperatura
        )
      );
      
      // Invalida le cache correlate
      this.invalidateCache(`cotture_${lavorazioneId}`);
      
      return response.data;
    } catch (error) {
      console.error(`Error registering temperatura for cottura ${cotturaId}:`, error);
      return this.formatErrorResponse(`Error registering temperatura for cottura with ID ${cotturaId}`);
    }
  }
}

// Esporta un'istanza singleton del service
export const lavorazioneService = new LavorazioneService();
