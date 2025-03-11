import { IMateriaPrima } from '../types/materiePrime.types';
import { ILavorazioneParcheggiata, IValidazione } from '../types/lavorazioni.types';

/**
 * Utility per tracking e validazione quantità
 */
export const trackingUtils = {
  /**
   * Calcola la quantità totale allocata per una materia prima
   * @param lavorazioni Lista lavorazioni parcheggiate
   * @param materiaPrimaId ID materia prima
   * @returns Quantità totale allocata
   */
  calculateTotalAllocated: (lavorazioni: ILavorazioneParcheggiata[], materiaPrimaId: string): number => {
    return lavorazioni
      .filter(l => l.materiaPrima.id === materiaPrimaId)
      .reduce((sum, l) => sum + l.quantitaTotale, 0);
  },

  /**
   * Calcola la quantità disponibile per una materia prima
   * @param materiaPrima Materia prima
   * @param lavorazioni Lista lavorazioni parcheggiate
   * @returns Quantità disponibile
   */
  calculateAvailable: (materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]): number => {
    const allocated = trackingUtils.calculateTotalAllocated(lavorazioni, materiaPrima._id);
    return materiaPrima.quantitaResidua - allocated;
  },

  /**
   * Verifica se una quantità è valida per una materia prima
   * @param quantity Quantità da verificare
   * @param materiaPrima Materia prima
   * @param lavorazioni Lista lavorazioni parcheggiate
   * @returns Oggetto validazione con stato e messaggio
   */
  validateQuantity: (quantity: number, materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]): IValidazione => {
    if (quantity <= 0) {
      return { 
        valido: false, 
        messaggio: 'La quantità deve essere maggiore di zero',
        codice: 'QUANTITY_ZERO'
      };
    }
    
    const available = trackingUtils.calculateAvailable(materiaPrima, lavorazioni);
    
    if (quantity > available) {
      return {
        valido: false,
        messaggio: `Quantità richiesta (${quantity.toFixed(2)} kg) superiore alla disponibilità (${available.toFixed(2)} kg)`,
        codice: 'QUANTITY_EXCEEDS'
      };
    }
    
    if (quantity > materiaPrima.quantitaResidua * 0.9) {
      return {
        valido: true,
        messaggio: 'Attenzione: stai utilizzando quasi tutta la quantità disponibile',
        codice: 'QUANTITY_WARNING'
      };
    }
    
    return {
      valido: true
    };
  },

  /**
   * Ottiene un oggetto di tracking completo per una materia prima
   * @param materiaPrima Materia prima
   * @param lavorazioni Lista lavorazioni parcheggiate
   * @returns Oggetto con totale, allocata e disponibile
   */
  getQuantityTracking: (materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]) => {
    const totale = materiaPrima.quantitaResidua;
    const allocata = trackingUtils.calculateTotalAllocated(lavorazioni, materiaPrima._id);
    const disponibile = totale - allocata;
    
    return {
      totale,
      allocata,
      disponibile,
      percentualeAllocata: (allocata / totale) * 100
    };
  }
};
