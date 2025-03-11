import { IMateriaPrima } from '../types/materiePrime.types';
import { IRicetta } from '../types/ricette.types';
import { ISuggerimento, ILavorazioneParcheggiata } from '../types/lavorazioni.types';

/**
 * Utility per calcoli di pianificazione
 */
export const calculationsUtils = {
  /**
   * Calcola la quantità consigliata per una ricetta basata sulla materia prima
   * @param ricetta Ricetta da valutare
   * @param materiaPrima Materia prima disponibile
   * @returns Quantità ottimale in kg
   */
  calcolaQuantitaConsigliata: (ricetta: IRicetta, materiaPrima: IMateriaPrima): number => {
    // Calcolo base: quantità disponibile della materia prima
    const quantitaDisponibile = materiaPrima.quantitaResidua;
    
    // Se non ci sono porzioni o grammi per porzione, restituisci la quantità disponibile
    if (!ricetta.porzioni || !ricetta.grammiPerPorzione) {
      return quantitaDisponibile;
    }
    
    // Calcola il numero massimo di porzioni con la quantità disponibile
    const porzioniPossibili = Math.floor((quantitaDisponibile * 1000) / ricetta.grammiPerPorzione);
    
    // Calcola la quantità ottimale basata sulle porzioni
    return (porzioniPossibili * ricetta.grammiPerPorzione) / 1000;
  },

  /**
   * Calcola il numero di porzioni ottenibili con una certa quantità
   * @param quantita Quantità in kg
   * @param grammiPerPorzione Grammi per porzione
   * @returns Numero di porzioni intero
   */
  calcolaPorzioniOttenibili: (quantita: number, grammiPerPorzione: number): number => {
    if (!grammiPerPorzione || grammiPerPorzione <= 0) {
      return 0;
    }
    
    return Math.floor((quantita * 1000) / grammiPerPorzione);
  },

  /**
   * Raggruppa ricette per tipo/categoria
   * @param suggerimenti Lista di suggerimenti
   * @returns Oggetto con suggerimenti raggruppati per tipo
   */
  raggruppaRicettePerTipo: (suggerimenti: ISuggerimento[]): { [key: string]: ISuggerimento[] } => {
    return suggerimenti.reduce((gruppi: { [key: string]: ISuggerimento[] }, sugg) => {
      const tipo = sugg.ricetta.categoria?.nome || 'Altro';
      
      if (!gruppi[tipo]) {
        gruppi[tipo] = [];
      }
      
      gruppi[tipo].push(sugg);
      return gruppi;
    }, {});
  },

  /**
   * Calcola status di compatibilità tra quantità richiesta e disponibile
   * @param quantitaRichiesta Quantità richiesta
   * @param quantitaDisponibile Quantità disponibile
   * @returns Status di compatibilità (ottima, buona, scarsa)
   */
  calcolaCompatibilita: (quantitaRichiesta: number, quantitaDisponibile: number): 'ottima' | 'buona' | 'scarsa' => {
    if (quantitaRichiesta <= 0 || quantitaDisponibile <= 0) {
      return 'scarsa';
    }
    
    const rapporto = quantitaRichiesta / quantitaDisponibile;
    
    if (rapporto <= 0.5) {
      return 'ottima';
    } else if (rapporto <= 0.8) {
      return 'buona';
    } else {
      return 'scarsa';
    }
  },

  /**
   * Prepara una nuova lavorazione a partire da ricetta e materia prima
   * @param ricetta Ricetta selezionata
   * @param materiaPrima Materia prima selezionata
   * @param quantita Quantità richiesta
   * @returns Oggetto lavorazione parziale
   */
  preparaNuovaLavorazione: (ricetta: IRicetta, materiaPrima: IMateriaPrima, quantita: number): Partial<ILavorazioneParcheggiata> => {
    return {
      ricettaId: ricetta._id,
      ricettaNome: ricetta.nome,
      materiaPrima: {
        id: materiaPrima._id,
        nome: materiaPrima.products[0]?.name || '',
        lotNumber: materiaPrima.products[0]?.lotNumber || ''
      },
      quantitaTotale: quantita,
      porzioniPreviste: calculationsUtils.calcolaPorzioniOttenibili(quantita, ricetta.grammiPerPorzione),
      grammiPerPorzione: ricetta.grammiPerPorzione,
      cliente: materiaPrima.cliente?.nome || 'N/D',
      clienteId: materiaPrima.cliente?._id || '',
      dataCreazione: new Date().toISOString()
    };
  }
};
