import { useCallback } from 'react';
import { usePianificazione } from './usePianificazione';
import { pianificazioneApi } from '../api/endpoints/pianificazioneApi';
import { IMateriaPrima } from '../types/materiePrime.types';
import { logger } from '../../../core/Path/logging/logger';

export const useMateriePrimeActions = () => {
  const { dispatch } = usePianificazione();
  
  const loadMateriePrime = useCallback(async () => {
    // Imposta lo stato di caricamento
    dispatch({ 
      type: 'SET_LOADING', 
      payload: { materiePrime: true } 
    });
    
    try {
      const response = await pianificazioneApi.getMateriePrimeDisponibili();
      
      if (response.success) {
        // Utilizziamo un'asserzione di tipo per chiarire a TypeScript che response.data è un array di IMateriaPrima
        const materiePrime = response.data as IMateriaPrima[];
        
        // Imposta le materie prime
        dispatch({ 
          type: 'SET_MATERIE_PRIME', 
          payload: materiePrime 
        });
        logger.info(`Caricate ${materiePrime.length} materie prime disponibili`);
      } else {
        throw new Error(response.message || 'Errore sconosciuto');
      }
    } catch (error) {
      logger.error(
        'Errore nel caricamento delle materie prime', 
        error instanceof Error ? error : new Error(String(error))
      );
      
      // Imposta l'errore
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          materiePrime: error instanceof Error ? error.message : String(error) 
        }
      });
    } finally {
      // Resetta lo stato di caricamento
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { materiePrime: false } 
      });
    }
  }, [dispatch]);
  
  const selectMateriaPrima = useCallback((materiaPrima: IMateriaPrima) => {
    dispatch({ 
      type: 'SET_SELECTED_MATERIA_PRIMA', 
      payload: materiaPrima 
    });
    logger.debug(`Selezionata materia prima: ${materiaPrima.products[0]?.name || 'N/A'}`);
  }, [dispatch]);
  
  return { loadMateriePrime, selectMateriaPrima };
};
