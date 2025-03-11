import { useCallback } from 'react';
import { usePianificazione } from './usePianificazione';
import { logger } from '../../../core/Path/logging/logger';

export const useUIActions = () => {
  const { dispatch } = usePianificazione();
  
  const setFiltroCliente = useCallback((filtro: string): void => {
    dispatch({ type: 'SET_FILTRO_CLIENTE', payload: filtro });
    logger.debug(`Impostato filtro cliente: ${filtro}`);
  }, [dispatch]);
  
  const setOrdinamento = useCallback((ordinamento: string): void => {
    dispatch({ type: 'SET_ORDINAMENTO', payload: ordinamento });
    logger.debug(`Impostato ordinamento: ${ordinamento}`);
  }, [dispatch]);
  
  const setShowLavorazioneLibera = useCallback((show: boolean): void => {
    dispatch({ type: 'SET_SHOW_LAVORAZIONE_LIBERA', payload: show });
    logger.debug(`Impostata visualizzazione lavorazione libera: ${show}`);
  }, [dispatch]);
  
  return { setFiltroCliente, setOrdinamento, setShowLavorazioneLibera };
};
