import { Service } from '@core/services/service';
import { IMateriaPrima } from '../types/materiePrime.types';
import { ILavorazioneParcheggiata, IValidazione } from '../types/lavorazioni.types';
import { trackingUtils } from '../utils/tracking.utils';

@Service('trackingService')
export class TrackingService {
  /**
   * Calcola il tracking delle quantità per una materia prima
   * @param materiaPrima Materia prima
   * @param lavorazioni Lavorazioni parcheggiate
   */
  getQuantityTracking(materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]) {
    return trackingUtils.getQuantityTracking(materiaPrima, lavorazioni);
  }
  
  /**
   * Valida una quantità rispetto alla disponibilità
   * @param quantity Quantità da validare
   * @param materiaPrima Materia prima
   * @param lavorazioni Lavorazioni parcheggiate
   */
  validateQuantity(
    quantity: number, 
    materiaPrima: IMateriaPrima, 
    lavorazioni: ILavorazioneParcheggiata[]
  ): IValidazione {
    return trackingUtils.validateQuantity(quantity, materiaPrima, lavorazioni);
  }
  
  /**
   * Calcola la quantità allocata totale per una materia prima
   * @param lavorazioni Lavorazioni parcheggiate
   * @param materiaPrimaId ID materia prima
   */
  calculateTotalAllocated(lavorazioni: ILavorazioneParcheggiata[], materiaPrimaId: string): number {
    return trackingUtils.calculateTotalAllocated(lavorazioni, materiaPrimaId);
  }
  
  /**
   * Calcola la quantità ancora disponibile per una materia prima
   * @param materiaPrima Materia prima
   * @param lavorazioni Lavorazioni parcheggiate
   */
  calculateAvailable(materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]): number {
    return trackingUtils.calculateAvailable(materiaPrima, lavorazioni);
  }
}
