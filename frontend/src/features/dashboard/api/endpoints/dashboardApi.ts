import { createApiService } from '../../../../core/api/api.service';
import { 
  StatisticsData, 
  ScheduleEventApiResponse, 
  KPIData, 
  RecentLavorazione, 
  MateriePrimeStats,
  Lavorazione  // Aggiungi questo tipo
} from '../../types';
interface DashboardLavorazioniResponse {
  success: boolean;
  data: Lavorazione[];
  meta: {
    total: number;
    filter: string;
  };
  message: string;
}
// Configurazione per debug/dev
const DEBUG_API = process.env.NODE_ENV !== 'production';

// Crea un'istanza dell'ApiService aggiornata con tutti gli endpoint necessari
const apiService = createApiService({
  baseURL: 'http://localhost:5000',
  endpoints: {
    // Endpoint per le statistiche generali
    'statistics': { 
      path: '/v2/api/statistics', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    
    // Endpoint per gli eventi del calendario
    'schedule': { 
      path: '/v2/api/schedule', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    
    // Endpoint per le statistiche delle materie prime
    'materiePrimeStats': { 
      path: '/v2/api/materie-prime/stats',
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    
    // Endpoint per le lavorazioni recenti
    'recentLavorazioni': { 
      path: '/v2/api/recent-lavorazioni', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    
    // Endpoint per i KPI
    'kpis': { 
      path: '/v2/api/kpis', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    
    // NUOVO: Endpoint per lavorazioni dashboard
    'dashboardLavorazioni': { 
      path: '/v2/api/dashboard-lavorazioni', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    }
  }
});

// Helper di debug per tracciare le chiamate API
const apiDebug = (method: string, ...args: any[]) => {
  if (DEBUG_API) {
    console.group(`🌐 API Call: ${method}`);
    if (args.length > 0) console.log('Arguments:', ...args);
    console.groupEnd();
  }
};

// API per la dashboard con metodi aggiornati
export const dashboardApi = {
  /**
   * Ottiene le statistiche generali della dashboard
   */
  getStatistics: () => {
    apiDebug('getStatistics');
    return apiService.request<StatisticsData>('statistics');
  },
  
  /**
   * Ottiene gli eventi pianificati per un periodo specificato
   * @param startDate Data inizio periodo (optional)
   * @param endDate Data fine periodo (optional)
   * @param types Tipi di eventi da filtrare (optional)
   */
  getSchedule: (startDate?: string, endDate?: string, types?: string) => {
    apiDebug('getSchedule', { startDate, endDate, types });
    return apiService.request<ScheduleEventApiResponse[]>('schedule', { 
      startDate, 
      endDate,
      types
    });
  },
  
  /**
   * Ottiene le statistiche delle materie prime
   */
  getMateriePrimeStats: () => {
    apiDebug('getMateriePrimeStats');
    return apiService.request<MateriePrimeStats>('materiePrimeStats');
  },
  
  /**
   * Ottiene le lavorazioni più recenti
   * @param limit Numero massimo di risultati da restituire
   */
  getRecentLavorazioni: (limit: number = 5) => {
    apiDebug('getRecentLavorazioni', { limit });
    return apiService.request<RecentLavorazione[]>('recentLavorazioni', { limit });
  },
  
  /**
   * Ottiene i KPI per un periodo specificato
   * @param period Periodo per il quale calcolare i KPI (day, week, month, year)
   */
  getKPIs: (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    apiDebug('getKPIs', { period });
    return apiService.request<KPIData>('kpis', { period });
  },
  
  /**
   * NUOVO: Ottiene le lavorazioni per la dashboard, filtrate per stato
   * @param stato Filtro per stato lavorazione (optional)
   * @param limit Numero massimo di risultati da restituire (optional)
   */
  getDashboardLavorazioni: (stato?: string, limit: number = 10) => {
    console.log('🌐 Chiamata getDashboardLavorazioni:', { path: '/v2/api/dashboard-lavorazioni', stato, limit });
    apiDebug('getDashboardLavorazioni', { stato, limit });
    return apiService.request<DashboardLavorazioniResponse>('dashboardLavorazioni', { 
      stato,
      limit
    });
  },
  /**
   * Verifica la disponibilità degli endpoint API
   * Utile per il debugging
   */
  checkEndpoints: async () => {
    apiDebug('checkEndpoints');
    const results: Record<string, boolean> = {};
    
    // Aggiungi il nuovo endpoint alla verifica
    for (const endpoint of ['statistics', 'materiePrimeStats', 'kpis', 'dashboardLavorazioni']) {
      try {
        await apiService.request(endpoint);
        results[endpoint] = true;
      } catch (error) {
        results[endpoint] = false;
        console.error(`Endpoint ${endpoint} non disponibile:`, error);
      }
    }
    
    return results;
  }
};
