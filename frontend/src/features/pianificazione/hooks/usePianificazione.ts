import { useContext } from 'react';
import { PianificazioneContext, PianificazioneContextValue } from '../context/PianificazioneContext';

/**
 * Hook principale per accedere al contesto della pianificazione.
 * Fornisce accesso allo state e al dispatch.
 */
export const usePianificazione = (): PianificazioneContextValue => {
  const context = useContext(PianificazioneContext);
  
  if (context === undefined) {
    throw new Error('usePianificazione deve essere usato all\'interno di un PianificazioneProvider');
  }
  
  return context;
};
