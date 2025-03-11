import { createApiService } from '../../../../core/api/api.service';
import { IRicetta } from '../../types/ricette.types';

// Crea un'istanza dell'ApiService con la configurazione completa
const apiService = createApiService({
  baseURL: 'http://localhost:5000', // URL di base del tuo server API
  endpoints: {
    'ricette': { 
      path: 'api/ricette', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    'ricetta': { 
      path: 'api/ricette', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    'ricettePerIngrediente': { 
      path: 'api/ricette/per-ingrediente', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    }
  }
});

export const ricetteApi = {
  /**
   * Ottiene tutte le ricette
   */
  getAll: () => 
    apiService.request<IRicetta[]>('ricette'),
  
  /**
   * Ottiene una ricetta per ID
   */
  getById: (id: string) => 
    apiService.request<IRicetta>('ricetta', { id }),
  
  /**
   * Ottiene ricette compatibili con un ingrediente
   */
  getForIngredient: (ingredient: string) => 
    apiService.request<IRicetta[]>('ricettePerIngrediente', { ingredient: encodeURIComponent(ingredient) })
};
