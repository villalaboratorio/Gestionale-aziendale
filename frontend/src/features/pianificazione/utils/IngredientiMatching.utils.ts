import { ICompatibilita } from '../types/lavorazioni.types';

/**
 * Utility per il matching degli ingredienti
 */
export const ingredientMatching = {
  /**
   * Verifica la compatibilità tra una materia prima e un ingrediente
   * @param materiaPrima Nome della materia prima
   * @param ingrediente Nome dell'ingrediente
   * @returns true se compatibili, false altrimenti
   */
  isCompatible: (materiaPrima: string, ingrediente: string): boolean => {
    const mpNome = materiaPrima.toLowerCase().trim();
    const ingNome = ingrediente.toLowerCase().trim();

    // Array di test di compatibilità in ordine di priorità
    const tests = [
      // Match esatto
      () => mpNome === ingNome,
      // Match senza spazi
      () => mpNome.replace(/\s/g, '') === ingNome.replace(/\s/g, ''),
      // Match prima parola
      () => mpNome.split(' ')[0] === ingNome.split(' ')[0],
      // Match parziale bidirezionale
      () => mpNome.includes(ingNome) || ingNome.includes(mpNome),
      // Match varianti (es: giallo, bianco)
      () => {
        const variants = ['giallo', 'bianco', 'rosso', 'nero'];
        return variants.some(variant => 
          (mpNome.includes(variant) && ingNome.includes(variant))
        );
      }
    ];

    // Esegue i test in ordine
    return tests.some(test => test());
  },

  /**
   * Calcola lo score di compatibilità tra materia prima e ingrediente
   * @param materiaPrima Nome della materia prima
   * @param ingrediente Nome dell'ingrediente
   * @returns Score da 0 a 1
   */
  getMatchScore: (materiaPrima: string, ingrediente: string): number => {
    const mpNome = materiaPrima.toLowerCase().trim();
    const ingNome = ingrediente.toLowerCase().trim();

    if (mpNome === ingNome) return 1;
    if (mpNome.replace(/\s/g, '') === ingNome.replace(/\s/g, '')) return 0.9;
    if (mpNome.split(' ')[0] === ingNome.split(' ')[0]) return 0.8;
    if (mpNome.includes(ingNome) || ingNome.includes(mpNome)) return 0.7;

    return 0;
  },

  /**
   * Verifica e restituisce dettagli sulla compatibilità
   * @param materiaPrima Nome della materia prima
   * @param ingrediente Nome dell'ingrediente
   * @param ingredienteId ID dell'ingrediente (opzionale)
   * @returns Oggetto compatibilità con score e dettagli
   */
  checkCompatibility: (materiaPrima: string, ingrediente: string, ingredienteId?: string): ICompatibilita => {
    const score = ingredientMatching.getMatchScore(materiaPrima, ingrediente);
    return {
      score,
      ingredienteId
    };
  }
};
