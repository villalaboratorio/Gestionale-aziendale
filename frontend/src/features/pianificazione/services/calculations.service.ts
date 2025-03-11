import { Service } from '@core/services/service';
import { serviceContainer } from '@core/services/service.container';
import { ISuggerimento } from '../types/lavorazioni.types';
import { IMateriaPrima } from '../types/materiePrime.types';
import { IRicetta } from '../types/ricette.types';
import { calculationsUtils } from '../utils/calculations.utils';
import { ICompatibilita } from '../types/lavorazioni.types';

// Definisci un'interfaccia per il servizio di matching
interface IIngredientMatchingService {
  findBestCompatibleIngredient(materiaPrima: IMateriaPrima, ricetta: IRicetta): ICompatibilita;
}

@Service('calculationsService')
export class CalculationsService {
  /**
   * Calcola suggerimenti di ricette per una materia prima
   * @param ricette Lista di ricette
   * @param materiaPrima Materia prima selezionata
   */
  calcolaSuggerimentiRicette(ricette: IRicetta[], materiaPrima: IMateriaPrima): ISuggerimento[] {
    // Ottiene il servizio di matching con cast al tipo corretto
    const matchingService = serviceContainer.get('ingredientMatchingService') as IIngredientMatchingService;
    
    // Filtra le ricette attive
    const ricetteAttive = ricette.filter(r => r.isActive);
    
    // Genera i suggerimenti
    return ricetteAttive.map(ricetta => {
      // Verifica compatibilità
      const compatibilita = matchingService.findBestCompatibleIngredient(materiaPrima, ricetta);
      
      // Calcola quantità consigliata
      const quantitaConsigliata = calculationsUtils.calcolaQuantitaConsigliata(ricetta, materiaPrima);
      
      // Calcola porzioni ottenibili
      const porzioniOttenibili = calculationsUtils.calcolaPorzioniOttenibili(
        quantitaConsigliata, 
        ricetta.grammiPerPorzione
      );
      
      // Crea il suggerimento
      return {
        ricetta,
        quantitaConsigliata,
        porzioniOttenibili,
        compatibilita
      };
    })
    // Ordina per compatibilità e poi per quantità
    .sort((a, b) => {
      if (b.compatibilita.score !== a.compatibilita.score) {
        return b.compatibilita.score - a.compatibilita.score;
      }
      return b.quantitaConsigliata - a.quantitaConsigliata;
    });
  }
  
  /**
   * Raggruppa ricette per tipo/categoria
   * @param suggerimenti Lista di suggerimenti
   */
  raggruppaRicettePerTipo(suggerimenti: ISuggerimento[]): { [key: string]: ISuggerimento[] } {
    return calculationsUtils.raggruppaRicettePerTipo(suggerimenti);
  }
  
  /**
   * Valida i parametri di un suggerimento
   * @param porzioni Numero di porzioni
   * @param grammiPerPorzione Grammi per porzione
   * @param maxPorzioni Numero massimo di porzioni disponibili
   */
  validaSuggerimento(
    porzioni: number, 
    grammiPerPorzione: number, 
    maxPorzioni: number
  ): { valido: boolean; messaggio?: string; codice?: string } {
    // Validazione grammi per porzione
    if (!grammiPerPorzione || grammiPerPorzione <= 0) {
      return {
        valido: false,
        messaggio: 'I grammi per porzione devono essere maggiori di zero',
        codice: 'INVALID_GRAMS'
      };
    }
    
    // Validazione porzioni
    if (!porzioni || porzioni <= 0) {
      return {
        valido: false,
        messaggio: 'Il numero di porzioni deve essere maggiore di zero',
        codice: 'INVALID_PORTIONS'
      };
    }
    
    // Validazione rispetto al massimo
    if (porzioni > maxPorzioni) {
      return {
        valido: false,
        messaggio: `Il numero di porzioni supera il massimo disponibile (${maxPorzioni})`,
        codice: 'EXCEEDS_MAX_PORTIONS'
      };
    }
    
    return { valido: true };
  }
  
  /**
   * Calcola la quantità in kg a partire da porzioni e grammi
   * @param porzioni Numero di porzioni
   * @param grammiPerPorzione Grammi per porzione
   */
  calcolaQuantitaKg(porzioni: number, grammiPerPorzione: number): number {
    return (porzioni * grammiPerPorzione) / 1000;
  }
}
