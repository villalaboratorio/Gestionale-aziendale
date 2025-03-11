import { createApiService } from '../../../core/api/index';
import { Lavorazione } from '../types/models.types';

export const useLavorazioneDetailActions = () => {
  // Funzione per caricare una lavorazione specifica
  const fetchLavorazione = async (id: string) => {
    const apiService = createApiService({
      baseURL: '/api',
      endpoints: {
        getLavorazione: {
          path: `/v2/lavorazioni/${id}`,
          method: 'GET',
          requiresAuth: true,
          cacheable: true
        }
      }
    });

    return apiService.request('getLavorazione');
  };

  // Funzione per salvare una lavorazione
  const saveLavorazione = async (id: string | null, data: Partial<Lavorazione>) => {
    const apiService = createApiService({
      baseURL: '/api',
      endpoints: {
        saveLavorazione: {
          path: id ? `/v2/lavorazioni/${id}` : '/v2/lavorazioni',
          method: id ? 'PUT' : 'POST',
          requiresAuth: true,
          cacheable: false
        }
      }
    });

    return apiService.request('saveLavorazione', data);
  };

  // Funzione per eliminare una lavorazione
  const deleteLavorazione = async (id: string) => {
    const apiService = createApiService({
      baseURL: '/api',
      endpoints: {
        deleteLavorazione: {
          path: `/v2/lavorazioni/${id}`,
          method: 'DELETE',
          requiresAuth: true,
          cacheable: false
        }
      }
    });

    return apiService.request('deleteLavorazione');
  };

  // Aggiunta: funzione per caricare le collezioni
  const fetchCollections = async () => {
    const apiService = createApiService({
      baseURL: '/api',
      endpoints: {
        getCollections: {
          path: '/lavorazioni/collections', // Assicurati che questo percorso sia corretto
          method: 'GET',
          requiresAuth: true,
          cacheable: true
        }
      }
    });

    return apiService.request('getCollections');
  };

  // Esporta tutte le funzioni
  return {
    fetchLavorazione,
    saveLavorazione,
    deleteLavorazione,
    fetchCollections
  };
};
