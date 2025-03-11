import { Lavorazione, Cottura } from './index';

export enum LavorazioneEventType {
  CREATED = 'lavorazione:created',
  UPDATED = 'lavorazione:updated',
  DELETED = 'lavorazione:deleted',
  STATUS_CHANGED = 'lavorazione:status_changed'
}

export enum CotturaEventType {
  STARTED = 'cottura:started',
  COMPLETED = 'cottura:completed',
  TEMPERATURE_CHANGED = 'cottura:temperature_changed',
  TIMER_UPDATE = 'cottura:timer_update'
}

export interface LavorazioneEvent {
  type: LavorazioneEventType;
  payload: {
    lavorazione: Lavorazione;
    changes?: Partial<Lavorazione>;
  };
  timestamp: number;
}

export interface CotturaEvent {
  type: CotturaEventType;
  payload: {
    cotturaId: string;
    lavorazioneId: string;
    data: Partial<Cottura>;
  };
  timestamp: number;
}
