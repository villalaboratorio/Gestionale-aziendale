import { IMateriaPrima } from './materiePrime.types';
import { ISuggerimento } from './lavorazioni.types';
import { ILavorazioneParcheggiata } from './lavorazioni.types';

export type { ILavorazioneParcheggiata };
// Definisce la struttura per il tracking delle quantità
export interface IQuantityTracking {
  totale: number;
  allocata: number;
  disponibile: number;
}

export interface IPianificazioneState {
  materiePrime: {
    items: IMateriaPrima[];
    selected: IMateriaPrima | null;
    loading: boolean;
    error: string | null;
  };
  suggerimenti: {
    items: ISuggerimento[];
    gruppi: Record<string, ISuggerimento[]>;
    selectedGruppo: string;
    loading: boolean;
    error: string | null;
  };
  lavorazioni: {
    parcheggiate: ILavorazioneParcheggiata[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    showConferma: boolean;
    filtroCliente: string;
    ordinamento: string;
    showLavorazioneLibera: boolean;
  };
}

export type PianificazioneAction = 
  // Materie prime
  | { type: 'SET_LOADING'; payload: { materiePrime?: boolean; suggerimenti?: boolean; operazioni?: boolean } }
  | { type: 'SET_MATERIE_PRIME'; payload: IMateriaPrima[] }
  | { type: 'SET_ERROR'; payload: { materiePrime?: string; suggerimenti?: string; operazioni?: string } }
  | { type: 'SET_SELECTED_MATERIA_PRIMA'; payload: IMateriaPrima }
  
  // Suggerimenti
  | { type: 'SET_SUGGERIMENTI'; payload: ISuggerimento[] }
  | { type: 'SET_GRUPPI_RICETTE'; payload: Record<string, ISuggerimento[]> }
  | { type: 'SET_SELECTED_GRUPPO'; payload: string }
  | { type: 'UPDATE_SUGGERIMENTO'; payload: { ricettaId: string; field: string; value: number } }
  
  // Lavorazioni
  | { type: 'ADD_LAVORAZIONE'; payload: ILavorazioneParcheggiata }
  | { type: 'UPDATE_LAVORAZIONE'; payload: { id: string; updatedData: Partial<ILavorazioneParcheggiata> } }
  | { type: 'REMOVE_LAVORAZIONE'; payload: string }
  | { type: 'CLEAR_LAVORAZIONI' }
  
  // UI
  | { type: 'SET_SHOW_CONFERMA'; payload: boolean }
  | { type: 'SET_FILTRO_CLIENTE'; payload: string }
  | { type: 'SET_ORDINAMENTO'; payload: string }
  | { type: 'SET_SHOW_LAVORAZIONE_LIBERA'; payload: boolean };

export interface IPianificazioneActions {
  // Materie prime
  loadMateriePrime: () => Promise<void>;
  selectMateriaPrima: (materiaPrima: IMateriaPrima) => void;
  
  // Suggerimenti
  loadSuggerimenti: (materiaPrimaId: string) => Promise<void>;
  updateSuggerimentoQuantita: (ricettaId: string, field: string, value: number) => void;
  selectGruppo: (gruppo: string) => void;
  
  // Lavorazioni
  addLavorazione: (lavorazione: Partial<ILavorazioneParcheggiata>) => Promise<ILavorazioneParcheggiata>;
  updateLavorazione: (id: string, updatedData: Partial<ILavorazioneParcheggiata>) => Promise<void>;
  removeLavorazione: (id: string) => Promise<void>;
  clearLavorazioni: () => Promise<void>;
  
  // Conferma
  confirmarLavorazioni: () => Promise<void>;
  setShowConferma: (show: boolean) => void;
  
  // UI
  setFiltroCliente: (filtro: string) => void;
  setOrdinamento: (ordinamento: string) => void;
  setShowLavorazioneLibera: (show: boolean) => void;
  
  // Tracking
  getQuantityTracking: (materiaPrimaId: string) => IQuantityTracking | null;
  validateQuantity: (materiaPrimaId: string, quantity: number) => boolean;
}
