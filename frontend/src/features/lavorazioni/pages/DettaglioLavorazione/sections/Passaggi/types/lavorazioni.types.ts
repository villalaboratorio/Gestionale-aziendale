export enum EventType {
    START = 'start',
    COMPLETE = 'complete',
    CHANGE_OPERATOR = 'change_operator',
    NOTE = 'note'
  }
  
  export interface LavorazioneEvent {
    type: EventType;
    timestamp: string;
    passaggioId: string;
    tipoPassaggio: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta';
    operatore?: string;
    description: string;
    note?: string;
  }
  
  export interface PassaggioOperazione {
    oraInizio?: Date | string;
    oraFine?: Date | string;
    operatore?: string;
    isStarted: boolean;
    isCompleted: boolean;
    note?: string;
  }
  
  // Estensione dell'interfaccia PassaggioLavorazione esistente
  export interface ExtendedPassaggioLavorazione {
    id: string;
    pelaturaMondatura?: PassaggioOperazione;
    lavaggioPulizia?: PassaggioOperazione;
    taglioMacinaAffetta?: PassaggioOperazione;
    eventi?: LavorazioneEvent[];
  }
  