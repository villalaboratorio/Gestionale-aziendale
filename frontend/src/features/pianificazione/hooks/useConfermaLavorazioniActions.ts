import { useCallback } from 'react';
import { usePianificazione } from './usePianificazione';
import { useMateriePrimeActions } from './useMateriePrimeActions';
import { useLavorazioniActions } from './useLavorazioniActions';
import { ILavorazioneParcheggiata } from '../types/lavorazioni.types'; // Ripristina questa import
import { pianificazioneApi } from '../api/endpoints/pianificazioneApi';
import { eventBus } from '../../../core/events';
import { logger } from '../../../core/Path/logging/logger';

export const useConfermaLavorazioniActions = () => {
  const { state, dispatch } = usePianificazione();
  const { clearLavorazioni } = useLavorazioniActions();
  const { loadMateriePrime } = useMateriePrimeActions();
  
  const setShowConferma = useCallback((show: boolean): void => {
    dispatch({ type: 'SET_SHOW_CONFERMA', payload: show });
  }, [dispatch]);
  
  // RIPRISTINA: Parametro opzionale per i campi extra
  const confirmarLavorazioni = useCallback(async (lavorazioniConCampiExtra?: Partial<ILavorazioneParcheggiata>[]): Promise<void> => {
    // Imposta lo stato di loading
    dispatch({ type: 'SET_LOADING', payload: { operazioni: true } });
    
    try {
      // Se sono stati forniti campi extra, usali, altrimenti usa le lavorazioni standard
      const lavorazioniFinali = lavorazioniConCampiExtra || state.lavorazioni.parcheggiate;
      
      if (lavorazioniFinali.length === 0) {
        throw new Error('Nessuna lavorazione da confermare');
      }
      
      logger.debug('Invio lavorazioni al server', { 
        lavorazioni: lavorazioniFinali,
        count: lavorazioniFinali.length 
      });      
      // CORRETTO: Avvolgiamo l'array in un oggetto
      const response = await pianificazioneApi.confermaLavorazioni({ 
        lavorazioni: lavorazioniFinali 
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Errore durante la conferma');
      }
      
      // Reset stato dopo conferma
      await clearLavorazioni();
      dispatch({ type: 'CLEAR_LAVORAZIONI' });
      
      // Notifica conferma tramite event bus
      eventBus.emit('LAVORAZIONI_CONFIRMED', { 
        count: lavorazioniFinali.length 
      });
      
      // Ricarica materie prime 
      await loadMateriePrime();
      
      logger.info(`Confermate ${lavorazioniFinali.length} lavorazioni`);
    } catch (error) {
      // Gestiamo l'errore
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      logger.error('Errore nella conferma lavorazioni', new Error(errorMessage));
      
      dispatch({
        type: 'SET_ERROR',
        payload: { operazioni: errorMessage }
      });
      
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { operazioni: false } });
    }
  }, [state.lavorazioni.parcheggiate, clearLavorazioni, loadMateriePrime, dispatch]);
  
  return { confirmarLavorazioni, setShowConferma };
};
