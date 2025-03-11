import { useCallback } from 'react';
import { IPianificazioneActions } from '../types/pianificazione.types';
import { useMateriePrimeActions } from './useMateriePrimeActions';
import { useSuggerimentiActions } from './useSuggerimentiActions';
import { useLavorazioniActions } from './useLavorazioniActions';
import { useConfermaLavorazioniActions } from './useConfermaLavorazioniActions';
import { useUIActions } from './useUIActions';
import { usePianificazioneState } from './usePianificazioneState';

/**
 * Hook principale che aggrega tutte le azioni della pianificazione
 * @returns Tutte le azioni disponibili per il modulo pianificazione
 */
export const usePianificazioneAction = (): IPianificazioneActions => {
  // Utilizziamo direttamente gli hook specifici
  const materiePrimeActions = useMateriePrimeActions();
  const suggerimentiActions = useSuggerimentiActions();
  const lavorazioniActions = useLavorazioniActions();
  const confermaActions = useConfermaLavorazioniActions();
  const uiActions = useUIActions();
  
  // Utilizziamo usePianificazioneState per il tracking delle quantità
  const { getQuantityTracking } = usePianificazioneState();
  
  // Funzione di utilità che verifica se una quantità è valida per una materia prima
  const validateQuantity = useCallback((materiaPrimaId: string, quantity: number): boolean => {
    if (!materiaPrimaId || quantity <= 0) return false;
    
    const tracking = getQuantityTracking(materiaPrimaId);
    return quantity <= tracking.disponibile;
  }, [getQuantityTracking]);
  
  // Restituiamo tutte le azioni combinate
  return {
    ...materiePrimeActions,
    ...suggerimentiActions,
    ...lavorazioniActions,
    ...confermaActions,
    ...uiActions,
    getQuantityTracking,
    validateQuantity
  };
};

export default usePianificazioneAction;
