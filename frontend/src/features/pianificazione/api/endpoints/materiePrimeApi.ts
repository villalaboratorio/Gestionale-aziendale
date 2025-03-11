import { createApiService } from '../../../../core/api/api.service';
import { IMateriaPrima, IPrelievo } from '../../types/materiePrime.types';

// Crea un'istanza dell'ApiService con la configurazione completa
const apiService = createApiService({
  baseURL: 'http://localhost:5000', // URL di base del tuo server API
  endpoints: {
    'materiePrime': { 
      path: '/v2/api/pianificazione/materie-prime',      method: 'GET', 
      cacheable: true,
      requiresAuth: true  // Proprietà richiesta aggiunta
    },
    'materiaPrima': { 
      path: '/v2api/pianificazione/materie-prime',      method: 'GET', 
      cacheable: true,
      requiresAuth: true  // Proprietà richiesta aggiunta
    },
    'prelievo': { 
      path: '/v2api/pianificazione/materie-prime',      method: 'POST', 
      cacheable: false,
      requiresAuth: true  // Proprietà richiesta aggiunta
    }
  }
});

export const materiePrimeApi = {
  /**
   * Ottiene tutte le materie prime
   */
  getAll: () => 
    apiService.request<IMateriaPrima[]>('materiePrime'),
  
  /**
   * Ottiene una materia prima per ID
   */
  getById: (id: string) => 
    apiService.request<IMateriaPrima>('materiaPrima', { id }),
  
  /**
   * Registra un prelievo da una materia prima
   */
  registerPrelievo: (id: string, data: Partial<IPrelievo>) => 
    apiService.request<IMateriaPrima>('prelievo', { id, ...data })
};
