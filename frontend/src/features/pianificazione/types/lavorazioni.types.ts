import { IRicetta } from './ricette.types';

export interface IMateriaPrimaReference {
  id: string;
  nome: string;
  lotNumber: string;
}
/**
 * Interfaccia che rappresenta la compatibilità tra un ingrediente e una materia prima
 */
export interface ICompatibilita {
  score: number;         // Punteggio di compatibilità da 0 a 1
  ingredienteId?: string; // ID dell'ingrediente compatibile
}

/**
 * Interfaccia per i risultati di validazione
 */
export interface IValidazione {
  valido: boolean;       // Se la validazione è passata
  messaggio?: string;    // Messaggio di errore
  codice?: string;       // Codice di errore per identificazione
}

/**
 * Interfaccia che rappresenta un suggerimento di ricetta per una materia prima
 */
export interface ISuggerimento {
  ricetta: IRicetta;     // Ricetta suggerita
  quantitaConsigliata: number;  // Quantità consigliata in kg
  porzioniOttenibili: number;   // Numero di porzioni ottenibili
  porzioniSelezionate?: number; // Porzioni selezionate dall'utente
  grammiPerPorzioneSelezionati?: number; // Grammi/porzione personalizzati
  quantitaCalcolata?: number;   // Quantità calcolata in base alle selezioni
  compatibilita: ICompatibilita; // Compatibilità con la materia prima
  validazione?: IValidazione;    // Stato di validazione
}

/**
 * Interfaccia che rappresenta una lavorazione temporanea (parcheggiata)
 */
export interface ILavorazioneParcheggiata {
  id: string;           // ID univoco della lavorazione parcheggiata
  ricettaId: string;    // ID della ricetta
  ricettaNome: string;  // Nome della ricetta per display
  materiaPrima: IMateriaPrimaReference;
  quantitaTotale: number;     // Quantità totale in kg
  porzioniPreviste: number;   // Numero di porzioni previste
  grammiPerPorzione: number;  // Grammi per porzione
  operatore?: string;    
  cliente: string;            // Nome cliente per display
  clienteId: string;          // ID cliente
  dataCreazione: string;      // Data creazione (ISO string)
  dataModifica?: string;      // Data ultima modifica (ISO string)
  note?: string;   
  dataConsegnaPrevista?: string | null;  // Data prevista per la consegna
  prioritaCliente?: string;        // Priorità assegnata dal cliente (bassa, media, alta)
  isUrgente?: boolean;     
}
/**
 * Interfaccia che rappresenta il dettaglio completo di una lavorazione
 */
export interface IDettaglioLavorazione {
  _id?: string;               // ID MongoDB (opzionale per creazione)
  numeroScheda?: string;      // Numero identificativo della scheda
  cliente: string;            // ID cliente
  ricetta: string;            // ID ricetta
  tipoLavorazione?: string;   // ID tipo lavorazione
  statoLavorazione: string;   // ID stato lavorazione
  operatore?: string;         // Nome operatore
  dataLavorazione: Date;      // Data di lavorazione
  dataConsegnaPrevista: Date; // Data prevista consegna
  prioritaCliente: 'bassa' | 'media' | 'alta'; // Priorità
  isUrgente: boolean;         // Flag urgenza
  motivazioneUrgenza?: string; // Motivazione urgenza
  porzioniPreviste: number;    // Porzioni previste
  grammiPerPorzione: number;   // Grammi per porzione
  quantitaPrevista: number;    // Quantità totale in kg
  materiaPrima: string;        // ID materia prima
  note?: string;               // Note generali
  
  // Campi opzionali per gestione completa lavorazione
  passaggiLavorazione?: Array<{
    id: string;
    pelaturaMondatura?: {
      oraInizio?: Date;
      oraFine?: Date;
      operatore?: string;
      isStarted: boolean;
      isCompleted: boolean;
      note?: string;
    };
    lavaggioPulizia?: {
      oraInizio?: Date;
      oraFine?: Date;
      operatore?: string;
      isStarted: boolean;
      isCompleted: boolean;
      note?: string;
    };
    taglioMacinaAffetta?: {
      oraInizio?: Date;
      oraFine?: Date;
      operatore?: string;
      isStarted: boolean;
      isCompleted: boolean;
      note?: string;
    };
  }>;
  
  cotture?: Array<{
    tipoCottura?: string;
    temperaturaTarget: number;
    addetto: string;
    stato: 'non_iniziata' | 'in_corso' | 'completata';
    inizio?: Date;
    fine?: Date;
    temperaturaFinale?: number;
    verificatoDa?: string;
  }>;
  
  abbattimento?: {
    inizio?: Date;
    fine?: Date;
    temperaturaIniziale?: number;
    temperaturaFinale?: number;
    addetto?: string;
    tempoTotale?: number;
    verificaTemperatura?: boolean;
    responsabileVerifica?: string;
    note?: string;
    stato: 'non_iniziato' | 'in_corso' | 'completato';
    validazione?: {
      isValidato?: boolean;
      valutazione?: 'ottimale' | 'veloce' | 'lento';
      note?: string;
    };
    tempoResiduoStimato?: number;
    dataFineStimata?: Date;
    readings?: Array<{
      timestamp: Date;
      temperatura: number;
    }>;
    tipoAlimento?: 'LIQUIDS' | 'LIGHT_SOLID' | 'MEDIUM_SOLID' | 'DENSE_SOLID' | 'FROZEN' | 'CUSTOM';
    tipoAbbattimento?: 'positivo' | 'negativo';
  };
  
  assemblaggio?: {
    crudo?: {
      ore?: string;
      addetto?: string;
      temperatura?: number;
      controlliQualita?: boolean;
      stato: 'non_iniziata' | 'in_corso' | 'completata';
      dataCompletamento?: Date;
      note?: string;
    };
    dopoCottura?: {
      ore?: string;
      addetto?: string;
      temperatura?: number;
      controlliQualita?: boolean;
      stato: 'non_iniziata' | 'in_corso' | 'completata';
      dataCompletamento?: Date;
      note?: string;
    };
    dopoCotturaParziale?: {
      ore?: string;
      addetto?: string;
      temperatura?: number;
      controlliQualita?: boolean;
      stato: 'non_iniziata' | 'in_corso' | 'completata';
      dataCompletamento?: Date;
      note?: string;
    };
    crudoSegueCottura?: {
      ore?: string;
      addetto?: string;
      temperatura?: number;
      controlliQualita?: boolean;
      stato: 'non_iniziata' | 'in_corso' | 'completata';
      dataCompletamento?: Date;
      note?: string;
    };
  };
  
  conservazione?: {
    imballaggio?: {
      plastica?: boolean;
      carta?: boolean;
      acciaio?: boolean;
      vetro?: boolean;
      alluminio?: boolean;
      sottovuoto?: boolean;
      altro?: string;
    };
    metodo?: {
      acqua?: boolean;
      liquidoGoverno?: boolean;
      agro?: boolean;
      olio?: boolean;
      altro?: string;
    };
    temperatura?: string;
    inizio?: Date;
    fine?: Date;
    cella?: string;
    shelf_life?: number;
    verificaImballaggio?: boolean;
    responsabileVerifica?: string;
  };
  
  valoriNutrizionali?: {
    calorie?: number;
    proteine?: number;
    grassi?: number;
    carboidrati?: number;
  };
}

/**
 * Tipo per report lavorazione
 */
export interface IReportLavorazione {
  lavorazioneId: string;
  dataGenerazione: Date;
  generatoDa: string;
  contenuto: string; // Contenuto JSON o HTML
  formato: 'json' | 'html' | 'pdf';
}

/**
 * Tipo per tracciamento quantità materia prima
 */
export interface IQuantityTracking {
  totale: number;      // Quantità totale disponibile
  allocata: number;    // Quantità allocata
  disponibile: number; // Quantità ancora disponibile
}

/**
 * Tipo per filtri di ricerca lavorazioni
 */
export interface ILavorazioneFiltri {
  cliente?: string;
  stato?: string;
  dataInizio?: Date;
  dataFine?: Date;
  ricetta?: string;
  materiaPrima?: string;
  isUrgente?: boolean;
}
