import { Lavorazione, InitialCollections, Cottura } from './models.types';
// Stati di caricamento per le varie operazioni
export interface LoadingState {
  main: boolean;
  operations: boolean;
  tabs: Record<string, boolean>;
}

// Stati di errore per le varie operazioni
export interface ErrorState {
  main: string | null;
  operations: string | null;
  tabs: Record<string, string | null>;
}

// Stato principale della lavorazione
export interface LavorazioneState {
  lavorazione: Lavorazione | null;
  collections: InitialCollections | null;
  loading: LoadingState;
  error: ErrorState;
  isDirty: boolean;
}

// Stato della cottura
export interface CotturaState {
  values: Partial<Cottura>;
  errors: Record<string, string>;
  isValid: boolean;
  isDirty: boolean;
  status: 'non_iniziata' | 'in_corso' | 'completata';
}

// Stato del form di cottura
export interface CotturaFormState {
  currentIndex: number;
  history: Array<Partial<Cottura>>;
  lastModified: Date | null;
}

// Stato delle operazioni di cottura
export interface CotturaOperationState {
  loading: boolean;
  error: string | null;
  lastAction: string | null;
  rollbackData: Partial<Cottura> | null;
}
