import { Service } from '@core/services/service';
import { ingredientMatching } from '../utils/IngredientiMatching.utils';
import { ICompatibilita } from '../types/lavorazioni.types';
import { IRicetta, IIngredienteRicetta } from '../types/ricette.types';
import { IMateriaPrima } from '../types/materiePrime.types';

@Service('ingredientMatchingService')
export class IngredientMatchingService {
  /**
   * Determina il miglior ingrediente compatibile in una ricetta
   * @param materiaPrima Materia prima da confrontare
   * @param ricetta Ricetta con ingredienti
   * @returns Migliore compatibilità trovata
   */
  findBestCompatibleIngredient(materiaPrima: IMateriaPrima, ricetta: IRicetta): ICompatibilita {
    if (!materiaPrima.products?.[0]?.name || !ricetta.ingredienti?.length) {
      return { score: 0 };
    }
    
    const nomeProdotto = materiaPrima.products[0].name;
    
    // Cerca match esatti prima
    const matchesExact = this.findCompatibleIngredients(nomeProdotto, ricetta.ingredienti, 1);
    if (matchesExact.length > 0) {
      return matchesExact[0];
    }
    
    // Poi cerca match parziali
    const matchesPartial = this.findCompatibleIngredients(nomeProdotto, ricetta.ingredienti, 0.7);
    if (matchesPartial.length > 0) {
      return matchesPartial[0];
    }
    
    // Se non trova match, restituisce la miglior compatibilità possibile
    return this.findBestMatch(nomeProdotto, ricetta.ingredienti);
  }
  
  /**
   * Trova tutti gli ingredienti compatibili con un certo score minimo
   * @param materiaPrimaNome Nome del prodotto materia prima
   * @param ingredienti Lista ingredienti della ricetta
   * @param minScore Score minimo richiesto
   */
  findCompatibleIngredients(
    materiaPrimaNome: string, 
    ingredienti: IIngredienteRicetta[], 
    minScore: number
  ): ICompatibilita[] {
    return ingredienti
      .map(ing => ({
        score: ingredientMatching.getMatchScore(materiaPrimaNome, ing.ingrediente.name),
        ingredienteId: ing.ingrediente._id
      }))
      .filter(match => match.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }
  
  /**
   * Trova il miglior match possibile anche se sotto la soglia minima
   * @param materiaPrimaNome Nome della materia prima
   * @param ingredienti Lista di ingredienti della ricetta
   */
  findBestMatch(materiaPrimaNome: string, ingredienti: IIngredienteRicetta[]): ICompatibilita {
    if (!ingredienti.length) return { score: 0 };
    
    return ingredienti
      .map(ing => ({
        score: ingredientMatching.getMatchScore(materiaPrimaNome, ing.ingrediente.name),
        ingredienteId: ing.ingrediente._id
      }))
      .reduce((best, current) => current.score > best.score ? current : best, { score: 0 });
  }
  
  /**
   * Verifica se una ricetta è compatibile con una materia prima
   * @param materiaPrima Materia prima
   * @param ricetta Ricetta da verificare
   * @returns true se compatibile, false altrimenti
   */
  isRecipeCompatible(materiaPrima: IMateriaPrima, ricetta: IRicetta): boolean {
    const compatibility = this.findBestCompatibleIngredient(materiaPrima, ricetta);
    return compatibility.score > 0.5; // Soglia minima di compatibilità
  }
}
