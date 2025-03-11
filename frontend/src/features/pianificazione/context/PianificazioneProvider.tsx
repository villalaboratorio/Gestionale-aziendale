import React, { useReducer, useEffect } from 'react';
import { PianificazioneContext, initialState } from './PianificazioneContext';
import { pianificazioneReducer } from './PianificazioneReducer';
import { ILavorazioneParcheggiata } from '../types/lavorazioni.types';
import { serviceContainer } from '../../../core/services/service.container';
import { logger } from '../../../core/Path/logging/logger';

// Definizione dell'interfaccia per il servizio storage
interface IStorageService {
  loadDraft: () => ILavorazioneParcheggiata[] | null;
  saveDraft: (lavorazioni: ILavorazioneParcheggiata[]) => void;
}

export const PianificazioneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pianificazioneReducer, initialState);
  
  // Carica le lavorazioni salvate all'avvio
  useEffect(() => {
    try {
      // Cast esplicito al tipo IStorageService
      const storageService = serviceContainer.get('storageService') as IStorageService;
      const savedLavorazioni = storageService.loadDraft();
      
      if (savedLavorazioni && savedLavorazioni.length > 0) {
        logger.info(`Caricate ${savedLavorazioni.length} lavorazioni dal localStorage`);
        
        // Aggiorna lo stato con le lavorazioni salvate
        dispatch({ 
          type: 'SET_LAVORAZIONI', 
          payload: savedLavorazioni 
        });
      }
    } catch (error) {
      logger.error('Errore nel caricamento delle lavorazioni salvate', error instanceof Error ? error : new Error(String(error)));
    }
  }, []);
  
  // Salva le lavorazioni quando cambiano
  useEffect(() => {
    try {
      if (state.lavorazioni.parcheggiate.length > 0) {
        const storageService = serviceContainer.get('storageService') as IStorageService;
        storageService.saveDraft(state.lavorazioni.parcheggiate);
        
        logger.debug(`Salvate ${state.lavorazioni.parcheggiate.length} lavorazioni nel localStorage`);
      }
    } catch (error) {
      logger.error('Errore nel salvataggio delle lavorazioni', error instanceof Error ? error : new Error(String(error)));
    }
  }, [state.lavorazioni.parcheggiate]);
  
  return (
    <PianificazioneContext.Provider value={{ state, dispatch }}>
      {children}
    </PianificazioneContext.Provider>
  );
};
