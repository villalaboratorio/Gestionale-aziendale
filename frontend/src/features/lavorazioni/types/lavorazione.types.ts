// hooks/types/lavorazione.types.ts
export interface Cliente {
    _id: string;
    nome: string;
    // altri campi cliente
}

export interface Ricetta {
    _id: string;
    nome: string;
    // altri campi ricetta
}

export interface TipoLavorazione {
    _id: string;
    nome: string;
    // altri campi tipo lavorazione
}

export interface Lavorazione {
    _id?: string;
    numeroScheda: string;
    cliente: Cliente;
    ricetta: Ricetta;
    tipoLavorazione: TipoLavorazione;
    dataLavorazione: string;
    dataConsegnaPrevista?: string;
    stato: {
        nome: string;
        colore: string;
    };
    faseCorrente?: string;
}

export interface Collections {
    clienti: Cliente[];
    ricette: Ricetta[];
    tipiLavorazione: TipoLavorazione[];
}
