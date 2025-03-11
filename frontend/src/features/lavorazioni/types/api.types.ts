import { Lavorazione, InitialCollections, Cottura } from './index';
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

export type LavorazioneResponse = ApiResponse<Lavorazione>;
export type CollectionsResponse = ApiResponse<InitialCollections>;
export type CottureResponse = ApiResponse<Cottura[]>;

export interface LavorazioneFilters {
  stato?: string;
  dataInizio?: string;
  dataFine?: string;
  ricetta?: string;
  operatore?: string;
}
