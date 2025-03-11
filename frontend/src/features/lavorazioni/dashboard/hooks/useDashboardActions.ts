import { createApiService } from '../../../../core/api';
import { ApiResponse } from '@core/types';

const apiService = createApiService({
  baseURL: 'http://localhost:5000',
  endpoints: {
    getLavorazioni: {
      path: '/v2/lavorazioni',  // Assicurati che questo path esista nel backend
      method: 'GET',
      requiresAuth: true,
      cacheable: false  // Imposta a false per evitare caching automatico
    }
  }
});

export const useDashboardActions = () => {
  const loadData = async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
    console.log('loadData chiamato con params:', params);
    try {
      return await apiService.request('getLavorazioni', params ? { params } : undefined);
    } catch (error) {
      console.error('Errore in loadData:', error);
      throw error;
    }
  };

  return {
    loadData
  };
};
