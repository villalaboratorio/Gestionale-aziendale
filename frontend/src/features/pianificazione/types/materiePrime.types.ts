export interface IMateriaPrimaProduct {
    name: string;
    quantity: number;
    unit: string;
    lotNumber: string;
  }
  
  export interface IPrelievo {
    quantitaPrelevata: number;
    dataPrelievo: Date;
    numeroPorzioni: number;
    grammiPerPorzione: number;
    quantitaResidua: number;
    lotNumber: string;
    destinazioneLavorazione?: string;
  }
  
  export interface IMateriaPrima {
    _id: string;
    documentNumber: string;
    date: Date;
    cliente: {
      _id: string;
      nome: string;
    };
    products: IMateriaPrimaProduct[];
    documentFile?: string;
    quantitaIniziale: number;
    quantitaResidua: number;
    prelievi: IPrelievo[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IMateriaPrimaFilters {
    search?: string;
    cliente?: string;
    lotto?: string;
    disponibilitaMin?: number;
  }
  