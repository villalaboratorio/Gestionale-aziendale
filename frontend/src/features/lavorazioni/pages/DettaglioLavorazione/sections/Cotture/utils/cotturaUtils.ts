import { Cottura, TipoCottura, StatoCottura } from '../../../../../types/models.types';

// Interfacce per migliorare la type safety
interface CotturaLike {
  temperatura?: number;
  temperaturaTarget?: number;
  tempoCottura?: number | TempoCotturaObject;
  inizio?: Date | string;
  fine?: Date | string;
  tipoCottura?: Partial<TipoCotturaExtended>;
  addetto?: string;
  operatore?: string;
}

// Interfaccia per gestire i diversi formati del tempo cottura
interface TempoCotturaObject {
  value?: number;
  durata?: number;
  seconds?: number;
  tempoMedio?: number;
}

// Interfaccia estesa per gestire campi legacy
interface TipoCotturaExtended extends TipoCottura {
  name?: string;
  description?: string;
  tempoMedioCottura?: number;
}

export const cotturaUtils = {
  /**
   * Converte il tempo da minuti a secondi
   * Usata principalmente per preparare i dati per il timer
   */
  minutiToSecondi: (minuti: number | string | undefined): number => {
    if (minuti === undefined || minuti === null) return 0;
    const min = typeof minuti === 'string' ? parseInt(minuti, 10) : minuti;
    return isNaN(Number(min)) ? 0 : Number(min) * 60;
  },
  
  /**
   * Converte il tempo da secondi a minuti
   * NOTA: Usare solo per convertire valori che sono effettivamente in secondi (es. dal timer)
   * NON usare per i valori dal database che sono già in minuti
   */
  secondiToMinuti: (secondi: number | string | undefined): number => {
    if (secondi === undefined || secondi === null) return 0;
    const sec = typeof secondi === 'string' ? parseInt(secondi, 10) : secondi;
    return isNaN(Number(sec)) ? 0 : Math.floor(Number(sec) / 60);
  },
  
  /**
   * Formatta il tempo in formato MM:SS per il timer
   */
  formatTime: (seconds: number): string => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  /**
   * Formatta la durata totale in formato più leggibile
   */
  formatDurataTotale: (seconds: number): string => {
    const ore = Math.floor(seconds / 3600);
    const minuti = Math.floor((seconds % 3600) / 60);
    
    if (ore > 0) {
      return `${ore}h ${minuti}m`;
    }
    return `${minuti}m`;
  },
  
  /**
   * Estrae il valore della temperatura da un oggetto cottura
   * gestendo i diversi nomi possibili del campo
   */
  getTemperatura: (cottura: CotturaLike | null | undefined): number => {
    if (!cottura) return 0;
    return cottura.temperatura || cottura.temperaturaTarget || 0;
  },
  
  /**
   * Trova l'oggetto TipoCottura completo da un ID
   */
  findTipoCotturaById: (id: string, tipiCottura: TipoCottura[]): TipoCottura | null => {
    return tipiCottura.find(tc => tc._id === id) || null;
  },
  
  /**
   * Calcola il tempo rimanente per una cottura in corso
   * IMPORTANTE: tempoCottura è in minuti e va convertito in secondi per i calcoli
   */
  calcolaTempoRimanente: (cottura: Cottura): number => {
    if (cottura.stato !== StatoCottura.IN_CORSO || !cottura.inizio) return 0;
    
    // Determina il tempo di cottura da utilizzare (in minuti)
    let tempoCotturaMinuti = 60; // Default 60 minuti
    
    // Verifica se abbiamo il tempo di cottura direttamente nell'oggetto
    if (typeof cottura.tempoCottura === 'number' && !isNaN(cottura.tempoCottura)) {
      tempoCotturaMinuti = cottura.tempoCottura;
    } 
    // Altrimenti, usa il tempo medio dal tipo cottura se disponibile
    else if (cottura.tipoCottura) {
      const tipoCotturaExt = cottura.tipoCottura as TipoCotturaExtended;
      const tempoMedioMinuti = tipoCotturaExt.tempoMedio || 
                              tipoCotturaExt.tempoMedioCottura || 
                              60;
      tempoCotturaMinuti = tempoMedioMinuti;
    }
    
    // Converti minuti in secondi per i calcoli del timer
    const tempoCotturaSecondi = tempoCotturaMinuti * 60;
    
    const startTime = new Date(cottura.inizio).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    
    return Math.max(0, tempoCotturaSecondi - elapsedSeconds);
  },

  /**
   * Ottiene il nome di un tipo cottura, gestendo diversi possibili nomi di campo
   */
  getNome: (tipo: Partial<TipoCotturaExtended> | null | undefined): string => {
    if (!tipo) return 'N/D';
    return tipo.nome || tipo.name || 'N/D';
  },

  /**
   * Ottiene il tempo medio di un tipo cottura in minuti
   */
  getTempoMedio: (tipo: Partial<TipoCotturaExtended> | null | undefined): number => {
    if (!tipo) return 60; // Default 60 minuti
    return tipo.tempoMedio || tipo.tempoMedioCottura || 60;
  },
  
  /**
   * Verifica se una cottura è completabile (ha superato il tempo minimo)
   */
  isCompletabile: (cottura: Cottura): boolean => {
    if (cottura.stato !== StatoCottura.IN_CORSO || !cottura.inizio) return false;
    
    // Ottenere il tempo cottura in minuti
    const tempoCotturaMinuti = typeof cottura.tempoCottura === 'number' ? cottura.tempoCottura : 0;
    
    // Converti il tempo minimo in secondi (80% del tempo previsto)
    const tempoMinimoSecondi = tempoCotturaMinuti * 0.8 * 60;
    
    const startTime = new Date(cottura.inizio).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    
    return elapsedSeconds >= tempoMinimoSecondi;
  }
};
