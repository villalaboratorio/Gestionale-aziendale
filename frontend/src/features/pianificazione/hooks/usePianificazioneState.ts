import { useMemo } from 'react';
import { usePianificazione } from './usePianificazione';
import { IQuantityTracking } from '../types/lavorazioni.types';

export const usePianificazioneState = () => {
  const { state } = usePianificazione();
  
  // Memoizza i valori per evitare calcoli inutili tra i render
  const materiePrime = useMemo(() => state.materiePrime.items, [state.materiePrime.items]);
  const materiaPrimaSelezionata = useMemo(() => state.materiePrime.selected, [state.materiePrime.selected]);
  const suggerimenti = useMemo(() => state.suggerimenti.items, [state.suggerimenti.items]);
  const lavorazioniParcheggiate = useMemo(() => state.lavorazioni.parcheggiate, [state.lavorazioni.parcheggiate]);
  
  // Per le funzioni di calcolo, è meglio usare useCallback invece di useMemo
  // Ma poiché getQuantityTracking è definita all'interno dell'hook e non cambia
  // tra i render, non c'è particolare necessità di memorizzarla
  const getQuantityTracking = (materiaPrimaId: string): IQuantityTracking => {
    if (!materiaPrimaId) {
      return { totale: 0, allocata: 0, disponibile: 0 };
    }
    
    const materiaPrima = materiePrime.find(mp => mp._id === materiaPrimaId);
    if (!materiaPrima) {
      return { totale: 0, allocata: 0, disponibile: 0 };
    }
    
    const allocata = lavorazioniParcheggiate
      .filter(lav => lav.materiaPrima.id === materiaPrimaId)
      .reduce((sum, lav) => sum + lav.quantitaTotale, 0);
    
    return {
      totale: materiaPrima.quantitaResidua,
      allocata,
      disponibile: materiaPrima.quantitaResidua - allocata
    };
  };
  
  return {
    materiePrime,
    materiaPrimaSelezionata,
    suggerimenti,
    lavorazioniParcheggiate,
    getQuantityTracking
    // Altri valori e funzioni
  };
};
