import  { createContext, Dispatch } from 'react';
import { IPianificazioneState } from '../types/pianificazione.types';
import { IMateriaPrima } from '../types/materiePrime.types';
import { ILavorazioneParcheggiata, ISuggerimento } from '../types/lavorazioni.types';

// Definisci il tipo per le azioni
export type PianificazioneAction = 
  | { type: 'SET_LOADING'; payload: Record<string, boolean> }
  | { type: 'SET_ERROR'; payload: Record<string, string | null> }
  | { type: 'SET_MATERIE_PRIME'; payload: IMateriaPrima[] }
  | { type: 'SET_SELECTED_MATERIA_PRIMA'; payload: IMateriaPrima }
  | { type: 'SET_SUGGERIMENTI'; payload: { suggerimenti: ISuggerimento[]; gruppi: Record<string, ISuggerimento[]> } }
  | { type: 'SET_SELECTED_GRUPPO'; payload: string }
  | { type: 'UPDATE_SUGGERIMENTO'; payload: { ricettaId: string; field: string; value: number } }
  | { type: 'ADD_LAVORAZIONE'; payload: ILavorazioneParcheggiata }
  | { type: 'UPDATE_LAVORAZIONE'; payload: { id: string; updatedData: Partial<ILavorazioneParcheggiata> } }
  | { type: 'REMOVE_LAVORAZIONE'; payload: string }
  | { type: 'CLEAR_LAVORAZIONI' }
  | { type: 'SET_LAVORAZIONI'; payload: ILavorazioneParcheggiata[] }
  | { type: 'SET_SHOW_CONFERMA'; payload: boolean }
  | { type: 'SET_FILTRO_CLIENTE'; payload: string }
  | { type: 'SET_ORDINAMENTO'; payload: string }
  | { type: 'SET_SHOW_LAVORAZIONE_LIBERA'; payload: boolean };

// Definisci l'interfaccia per il valore del contesto
export interface PianificazioneContextValue {
  state: IPianificazioneState;
  dispatch: Dispatch<PianificazioneAction>;
}

// Crea il contesto
export const PianificazioneContext = createContext<PianificazioneContextValue | undefined>(undefined);

// Stato iniziale
export const initialState: IPianificazioneState = {
  materiePrime: {
    items: [],
    selected: null,
    loading: false,
    error: null
  },
  suggerimenti: {
    items: [],
    loading: false,
    error: null,
    gruppi: {},
    selectedGruppo: 'tutti'
  },
  lavorazioni: {
    parcheggiate: [],
    loading: false,
    error: null
  },
  ui: {
    showConferma: false,
    filtroCliente: 'tutti',
    ordinamento: 'data',
    showLavorazioneLibera: false
  }
};
