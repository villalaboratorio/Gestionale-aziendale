// Statistiche generali
export interface StatisticsData {
  totals: {
    inCorso: number;
    inAttesa: number;
    completate: number;
    totale: number;
  };
  performance: {
    efficienza: number;
    tempoMedio: number;
  };
  trends: Array<{
    tipo: string;
    valore: number;
    direction?: 'up' | 'down' | 'neutral';
  }>;
}

// Dati degli eventi per il calendario
export interface ScheduleEventApiResponse {
  _id: string;
  date: string;
  time: string;
  title: string;
  description?: string;
  client?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'urgent';
  type: 'lavorazione' | 'consegna' | 'ricevimento' | 'altro';
  detailsUrl: string;
}

// Item evento formattato per visualizzazione
export interface ScheduledItem {
  _id: string;
  title: string;
  time: string;
  description: string;
  client: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'urgent';
  type: 'lavorazione' | 'consegna' | 'ricevimento' | 'altro';
  detailsUrl: string;
}

// Gruppo di eventi per giorno
export interface DayEvents {
  date: string;
  dayName: string;
  isToday: boolean;
  items: ScheduledItem[];
}

// Statistiche materie prime
export interface MateriePrimeStats {
  totaleInGiacenza: number;
  critiche: number;
  inScadenza: number;
  percUtilizzo: number;
}

// Dati delle lavorazioni recenti
export interface RecentLavorazione {
  _id: string;
  numeroScheda: string;
  cliente: string;
  ricetta: string;
  stato: string;
  dataConsegna: string;
  giorniRimanenti: number | null;
  operatore: string;
  isUrgente: boolean;
  detailsUrl: string;
  Lavorazione,
}

// Dati KPI
export interface KPIData {
  lavorazioniCompletate: number;
  porzioniProdotte: number;
  kgProcessati: number;
  efficienza: number;
}
import { Lavorazione } from '../../lavorazioni/types';
export type { Lavorazione };
