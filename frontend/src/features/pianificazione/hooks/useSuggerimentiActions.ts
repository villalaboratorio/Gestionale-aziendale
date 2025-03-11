import { useCallback } from 'react';
import { usePianificazione } from './usePianificazione';
import { pianificazioneApi } from '../api/endpoints/pianificazioneApi';
import { logger } from '../../../core/Path/logging/logger';
import { calculationsUtils } from '../utils/calculations.utils';

export const useSuggerimentiActions = () => {
  // Rimuoviamo state dalla destrutturazione se non viene usato
  const { dispatch } = usePianificazione();
  
  const loadSuggerimenti = useCallback(async (materiaPrimaId: string) => {
    console.log("ID ricevuto:", materiaPrimaId);
    if (!materiaPrimaId) {
      console.error("ID materia prima non valido:", materiaPrimaId);
      logger.warn('Tentativo di caricare suggerimenti senza un ID materia prima');
      return;
    }
    
    // Imposta lo stato di caricamento
    dispatch({ 
      type: 'SET_LOADING', 
      payload: { suggerimenti: true } 
    });
    
    try {
      const response = await pianificazioneApi.getSuggerimentiRicette(materiaPrimaId);
      
      if (response.success) {
        // Raggruppa per categoria
        const gruppi = calculationsUtils.raggruppaRicettePerTipo(response.data);
        
        dispatch({ 
          type: 'SET_SUGGERIMENTI', 
          payload: {
            suggerimenti: response.data,
            gruppi
          }
        });
        
        logger.info(`Caricati ${response.data.length} suggerimenti per materia prima: ${materiaPrimaId}`);
      } else {
        throw new Error(response.message || 'Errore sconosciuto');
      }
    } catch (error) {
      logger.error(
        'Errore nel caricamento dei suggerimenti',
        error instanceof Error ? error : new Error(String(error))
      );
      
      // Imposta l'errore
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          suggerimenti: error instanceof Error ? error.message : String(error) 
        }
      });
    } finally {
      // Resetta lo stato di caricamento
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { suggerimenti: false } 
      });
    }
  }, [dispatch]);
  
  const updateSuggerimentoQuantita = useCallback((ricettaId: string, field: string, value: number) => {
    dispatch({ 
      type: 'UPDATE_SUGGERIMENTO', 
      payload: { ricettaId, field, value } 
    });
  }, [dispatch]);
  
  const selectGruppo = useCallback((gruppo: string) => {
    dispatch({ 
      type: 'SET_SELECTED_GRUPPO', 
      payload: gruppo 
    });
  }, [dispatch]);
  
  return { loadSuggerimenti, updateSuggerimentoQuantita, selectGruppo };
};
