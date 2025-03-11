import { TipoCottura, Cottura, Ricetta, StatoCottura } from '../types/models.types';

// Definizione di un'interfaccia per i dati dal backend
interface TipoCotturaBackend {
  _id: string;
  name?: string;
  description?: string;
  temperaturaMin?: number;
  temperaturaMax?: number;
  tempoMedioCottura?: number;
}
// Interfaccia per ingredienti dal backend
interface IngredienteBackend {
  nome: string;
  quantita: number;
  unita: string;
}
// Interfaccia per cotture dal backend
interface CotturaBackend {
  _id?: string;
  tipoCottura: TipoCotturaBackend; // Tipo generico per il backend
  temperatura: number;
  tempoCottura?: number;
  addetto: string;
  stato: string;
  inizio?: string | Date;
  fine?: string | Date;
  temperaturaFinale?: number;
  verificatoDa?: string;
  note?: string;
  ordine?: number;
}

// Interfaccia per ricette dal backend
interface RicettaBackend {
  _id: string;
  name?: string;
  nome?: string;
  codice?: string;
  description?: string;
  descrizione?: string;
  ingredienti?: IngredienteBackend[];
  cotture?: CotturaBackend[];
}

/**
 * Utility per accedere in modo sicuro ai campi di TipoCottura, Cottura e Ricetta
 * supportando sia il formato frontend che backend
 */
export const getTipoCotturaUtils = {
  // Funzioni esistenti
  getNome: (tipo: TipoCottura | null | undefined): string => {
    if (!tipo) return '';
    return tipo.nome || tipo.name || '';
  },

  getDescrizione: (tipo: TipoCottura | null | undefined): string => {
    if (!tipo) return '';
    return tipo.descrizione || tipo.description || '';
  },

  getTempoMedio: (tipo: TipoCottura | null | undefined): number => {
    if (!tipo) return 0;
    return tipo.tempoMedio || tipo.tempoMedioCottura || 0;
  },

  normalizeFromBackend: (tipo: TipoCotturaBackend | null | undefined): TipoCottura | null => {
    if (!tipo) return null;
    
    return {
      _id: tipo._id,
      nome: tipo.name || '',
      name: tipo.name || '',
      descrizione: tipo.description || '',
      description: tipo.description || '',
      temperaturaMin: tipo.temperaturaMin,
      temperaturaMax: tipo.temperaturaMax,
      tempoMedio: tipo.tempoMedioCottura,
      tempoMedioCottura: tipo.tempoMedioCottura
    };
  },

  normalizeArrayFromBackend: (tipi: TipoCotturaBackend[] | null | undefined): TipoCottura[] => {
    if (!tipi || !Array.isArray(tipi)) return [];
    return tipi.map(tipo => getTipoCotturaUtils.normalizeFromBackend(tipo)).filter(Boolean) as TipoCottura[];
  },

  // NUOVE FUNZIONI PER COTTURE
  normalizeCotturaFromBackend: (cottura: CotturaBackend | null | undefined): Cottura | null => {
    if (!cottura) return null;
    
    // Normalizza il tipoCottura all'interno della cottura
    const tipoCottura = getTipoCotturaUtils.normalizeFromBackend(cottura.tipoCottura);
    
    return {
      _id: cottura._id,
      tipoCottura: tipoCottura as TipoCottura,
      temperatura: cottura.temperatura,
      tempoCottura: cottura.tempoCottura,
      addetto: cottura.addetto || '',
      stato: (cottura.stato as StatoCottura) || StatoCottura.NON_INIZIATA,
      inizio: cottura.inizio,
      fine: cottura.fine,
      temperaturaFinale: cottura.temperaturaFinale,
      verificatoDa: cottura.verificatoDa
    };
  },
  
  normalizeCottureArrayFromBackend: (cotture: CotturaBackend[] | null | undefined): Cottura[] => {
    if (!cotture || !Array.isArray(cotture)) return [];
    return cotture.map(c => getTipoCotturaUtils.normalizeCotturaFromBackend(c)).filter(Boolean) as Cottura[];
  },
  
  // NUOVE FUNZIONI PER RICETTE
  normalizeRicettaFromBackend: (ricetta: RicettaBackend | null | undefined): Ricetta | null => {
    if (!ricetta) return null;
    
    return {
      _id: ricetta._id,
      nome: ricetta.nome || ricetta.name || '',
      codice: ricetta.codice || '',
      descrizione: ricetta.descrizione || ricetta.description || '',
      ingredienti: ricetta.ingredienti || [],
      // Normalizza anche l'array di cotture
      cotture: getTipoCotturaUtils.normalizeCottureArrayFromBackend(ricetta.cotture)
    };
  },
  
  normalizeRicetteArrayFromBackend: (ricette: RicettaBackend[] | null | undefined): Ricetta[] => {
    if (!ricette || !Array.isArray(ricette)) return [];
    return ricette.map(r => getTipoCotturaUtils.normalizeRicettaFromBackend(r)).filter(Boolean) as Ricetta[];
  }
};
