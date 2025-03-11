import { createApiService } from '../../../../core/api/api.service';
import { ILavorazioneParcheggiata } from '../../types/lavorazioni.types';
import { IMateriaPrima } from '../../types/materiePrime.types';
import { ISuggerimento } from '../../types/lavorazioni.types';

// Crea un'istanza dell'ApiService
const apiService = createApiService({
  baseURL: 'http://localhost:5000',
  endpoints: {
    'materiePrimeDisponibili': { 
      path: '/v2/api/pianificazione/materie-prime', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    'suggerimentiRicette': { 
      path: '/v2/api/pianificazione/suggerimenti', 
      method: 'GET', 
      cacheable: true,
      requiresAuth: true
    },
    'confermaLavorazioni': { 
      path: '/v2/api/pianificazione/conferma', 
      method: 'POST', 
      cacheable: false,
      requiresAuth: true
    }
  }
});

// Definire un tipo più specifico per i dettagli
interface DettaglioConferma {
  lavorazioneId: string;
  stato: string;
  messaggio?: string;
}

// Definiamo un tipo per la risposta, estendendo ApiResponse
interface ConfermaLavorazioniResponse {
  success: boolean;
  message?: string;
  dettagli?: DettaglioConferma[]; // Tipo più specifico rispetto a Array<any>
}

// Utilizziamo l'import di ApiResponse nei commenti per evitare il warning 'unused import'
/**
 * API per la pianificazione
 * @returns {Object} oggetto con metodi che restituiscono {@link ApiResponse}
 */
export const pianificazioneApi = {
  /**
   * Ottiene materie prime disponibili
   * @returns {Promise<ApiResponse<IMateriaPrima[]>>} Risposta API contenente array di materie prime
   */
  getMateriePrimeDisponibili: () => 
    apiService.request<IMateriaPrima[]>('materiePrimeDisponibili'),
  
  /**
   * Ottiene suggerimenti ricette per una materia prima
   * @returns {Promise<ApiResponse<ISuggerimento[]>>} Risposta API contenente array di suggerimenti
   */
  getSuggerimentiRicette: (materiaPrimaId: string) => 
    apiService.request<ISuggerimento[]>('suggerimentiRicette', { materiaPrimaId }),
  
  /**
   * Conferma lavorazioni e crea dettagli lavorazione
   * @param data Oggetto con proprietà lavorazioni
   * @returns {Promise<ApiResponse<ConfermaLavorazioniResponse>>} Risposta API
   */
  confermaLavorazioni: (data: { lavorazioni: Partial<ILavorazioneParcheggiata>[] }) => 
    apiService.request<ConfermaLavorazioniResponse>('confermaLavorazioni', data)
};
