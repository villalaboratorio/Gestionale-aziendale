export interface IIngredienteRicetta {
    ingrediente: {
      _id: string;
      name: string;
    };
    quantita: number;
    unitaMisura: {
      _id: string;
      name: string;
      abbreviation: string;
    };
    caloPeso?: number;
  }
  
  export interface IFase {
    tipoLavorazione: {
      _id: string;
      nome: string;
    };
    metodo: {
      _id: string;
      nome: string;
    };
    tempo?: number;
    descrizione?: string;
    ordine: number;
  }
  
  export interface ICottura {
    tipoCottura: {
      _id: string;
      nome: string;
    };
    temperatura: number;
    tempoCottura: number;
    note?: string;
    ordine: number;
  }
  
  export interface ICategoria {
    _id: string;
    nome: string;
  }
  
  export interface IRicetta {
    _id: string;
    numeroRicetta: string;
    nome: string;
    categoria: ICategoria;
    descrizione?: string;
    porzioni: number;
    grammiPerPorzione: number;
    pesoTotale: number;
    tempoPreparazione?: number;
    tempoCottura?: number;
    temperatura?: number;
    difficolta: 'facile' | 'media' | 'difficile';
    stagionalita: 'primavera' | 'estate' | 'autunno' | 'inverno' | "tutto l'anno";
    fasi: IFase[];
    ingredienti: IIngredienteRicetta[];
    cotture: ICottura[];
    noteCottura?: string;
    isActive: boolean;
    cliente?: string;
    clienteId?: string;
    tipo?: string;
    
  }
  