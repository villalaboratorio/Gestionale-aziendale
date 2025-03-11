// Definizione dei tipi per enum
export enum StatoCottura {
    NON_INIZIATA = 'non_iniziata',
    IN_CORSO = 'in_corso',
    COMPLETATA = 'completata'
  }
  // Aggiungiamo l'enum per lo stato dell'abbattimento
export enum StatoAbbattimento {
  NON_INIZIATO = 'non_iniziato',
  IN_CORSO = 'in_corso',
  COMPLETATO = 'completato'
}
  // Enum per gli stati delle fasi di assemblaggio
export enum StatoAssemblaggio {
  NON_INIZIATA = 'non_iniziata',
  IN_CORSO = 'in_corso',
  COMPLETATA = 'completata'
}
  // Interfacce per entità base
  export interface StatoLavorazione {
    _id: string;
    nome: string;
    name?: string; // Supporto per entrambe le versioni dell'API
    codice: string;
    descrizione?: string;
    description?: string; // Supporto per entrambe le versioni dell'API
  }
  
  export interface TipoLavorazione {
    _id: string;
    nome: string;
    name?: string; // Supporto per entrambe le versioni dell'API
    description?: string; // Supporto per entrambe le versioni dell'API
  }
  
  export interface TipoCottura {
    _id: string;
    
    // Supporto per entrambi i formati di nome
    nome?: string;
    name?: string;
    
    // Supporto per entrambi i formati di descrizione
    descrizione?: string;
    description?: string;
    
    // Campi temperatura rimangono uguali perché hanno lo stesso nome
    temperaturaMin?: number;
    temperaturaMax?: number;
    
    // Supporto per entrambi i formati di tempo medio
    tempoMedio?: number;
    tempoMedioCottura?: number;
  }
  
  export interface Ingrediente {
    nome: string;
    quantita: number;
    unita: string;
  }
  
  export interface Cliente {
    _id: string;
    nome: string;
    email?: string;
    telefono?: string;
    indirizzo?: string;
    partitaIva?: string;
    codFiscale?: string;
    riferimento?: string;
  }
  
  export interface Cottura {
    _id?: string;
    tipoCottura: TipoCottura;
    temperatura: number;
    tempoCottura?: number;
    addetto: string;
    stato: StatoCottura;
    inizio?: string | Date;
    fine?: string | Date;
    finePrevista?: string | Date;
    temperaturaFinale?: number;
    noteInterruzione?: string;
    verificatoDa?: string;
  }
  
  export interface Ricetta {
    _id: string;
    nome: string;
    codice?: string;
    descrizione?: string;
    ingredienti?: Ingrediente[];
    cotture?: Cottura[];
  }
  
  // Interfacce per i sottosistemi di lavorazione
  export interface PassaggioLavorazione {
    id: string;
    pelaturaMondatura?: {
      oraInizio?: Date;
      oraFine?: Date;
      operatore?: string;
      isStarted: boolean;
      isCompleted: boolean;
    };
    lavaggioPulizia?: {
      oraInizio?: Date;
      oraFine?: Date;
      operatore?: string;
      isStarted: boolean;
      isCompleted: boolean;
    };
    taglioMacinaAffetta?: {
      oraInizio?: Date;
      oraFine?: Date;
      operatore?: string;
      isStarted: boolean;
      isCompleted: boolean;
    };
  }
  
  export interface Abbattimento {
    inizio?: Date | string;
    fine?: Date | string;
    temperaturaIniziale?: number;
    temperaturaFinale?: number;
    addetto?: string;
    tempoTotale?: number;
    verificaTemperatura?: boolean;
    responsabileVerifica?: string;
  }
  
  export interface FaseAssemblaggio {
    ore?: string;
    addetto?: string;
    temperatura?: number;
    controlliQualita?: boolean;
    stato?: StatoAssemblaggio;
    dataCompletamento?: string | Date;
    note?: string;
  }
  
  export interface Assemblaggio {
    crudo?: FaseAssemblaggio;
    dopoCottura?: FaseAssemblaggio;
    dopoCotturaParziale?: FaseAssemblaggio;
    crudoSegueCottura?: FaseAssemblaggio;
  }
  
  export interface Conservazione {
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
  }
  
  export interface ValoriNutrizionali {
    calorie?: number;
    proteine?: number;
    grassi?: number;
    carboidrati?: number;
  }
  
  // Interfaccia principale per lavorazione
  export interface Lavorazione {
    _id: string;
    numeroScheda?: string;
    codice?: string; // Supporto per versioni precedenti
    cliente?: Cliente;
    ricetta: Ricetta;
    tipoLavorazione?: TipoLavorazione;
    statoLavorazione?: StatoLavorazione;
    stato?: StatoLavorazione; // Supporto per versioni precedenti
    
    // Date e priorità
    dataLavorazione?: string | Date;
    dataConsegnaPrevista?: string | Date;
    dataInizio?: Date; // Supporto per versioni precedenti
    dataFine?: Date; // Supporto per versioni precedenti
    prioritaCliente?: 'bassa' | 'media' | 'alta';
    isUrgente?: boolean;
    motivazioneUrgenza?: string; // Campo aggiunto per gestire la motivazione dell'urgenza
    
    // Note
    operatore?: string;
    noteProduzione?: string;
    noteAllergeni?: string;
    noteConfezionamento?: string;
    note?: string; // Supporto per versioni precedenti
    
    // Sistemi di lavorazione
    passaggiLavorazione?: PassaggioLavorazione[];
    cotture?: Cottura[];
    abbattimento?: Abbattimento;
    assemblaggio?: Assemblaggio;
    conservazione?: Conservazione;
    valoriNutrizionali?: ValoriNutrizionali;
    
    // Metadati
    createdAt?: string;
    updatedAt?: string;
  }
  export interface QuantityType {
    _id: string;
    name: string;
    abbreviation: string;
    description?: string;
  }
  export interface InitialCollections {
    clienti: Cliente[];
    ricette: Ricetta[];
    tipiLavorazione: TipoLavorazione[];
    statiLavorazione: StatoLavorazione[];
    quantityTypes?: QuantityType[]; 
    tipiCottura: TipoCottura[]
  }
// Interfaccia per i dati dell'abbattimento
export interface Abbattimento {
  inizio?: Date | string;
  fine?: Date | string;
  temperaturaIniziale?: number;
  temperaturaFinale?: number;
  addetto?: string;
  tempoTotale?: number; // in minuti
  verificaTemperatura?: boolean;
  responsabileVerifica?: string;
  stato?: StatoAbbattimento;
  note?: string;
}