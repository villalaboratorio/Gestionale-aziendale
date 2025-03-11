import { useState, useCallback } from 'react';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { FaseAssemblaggio, StatoAssemblaggio } from '../../../../../types/models.types';

export const useAssemblaggioManager = () => {
  const { 
    data: { lavorazione, collections },
    loadingStates: { operations: loading },
    actions
  } = useLavorazioneContext();
  
  const [activePhase, setActivePhase] = useState<string | null>(null);
  
  // Ottieni gli operatori disponibili
  const operatori = collections?.quantityTypes
    ?.filter(qt => qt.name)
    .map(qt => qt.name) || [];
  
  // Ottieni assemblaggio dalla lavorazione
  const assemblaggio = lavorazione?.assemblaggio || {};
  
  // Avvia una fase di assemblaggio
  const startFase = useCallback(async (fase: string, dati: Partial<FaseAssemblaggio>) => {
    if (!lavorazione) return;
    
    try {
      const lavorazioneAggiornata = { ...lavorazione };
      
      // Inizializza assemblaggio se non esiste
      if (!lavorazioneAggiornata.assemblaggio) {
        lavorazioneAggiornata.assemblaggio = {};
      }
      
      // Aggiorna la fase specifica
      lavorazioneAggiornata.assemblaggio[fase] = {
        ...dati,
        stato: StatoAssemblaggio.IN_CORSO,
        ore: new Date().toISOString()
      };
      
      await actions.handleSave(lavorazioneAggiornata);
    } catch (error) {
      console.error(`Errore durante l'avvio della fase ${fase}:`, error);
      throw error;
    }
  }, [lavorazione, actions]);
  
  // Completa una fase di assemblaggio
  const completeFase = useCallback(async (fase: string, dati: Partial<FaseAssemblaggio>) => {
    if (!lavorazione) return;
    
    try {
      const lavorazioneAggiornata = { ...lavorazione };
      
      // Aggiorna la fase specifica
      if (lavorazioneAggiornata.assemblaggio && lavorazioneAggiornata.assemblaggio[fase]) {
        lavorazioneAggiornata.assemblaggio[fase] = {
          ...lavorazioneAggiornata.assemblaggio[fase],
          ...dati,
          stato: StatoAssemblaggio.COMPLETATA,
          dataCompletamento: new Date().toISOString()
        };
      }
      
      await actions.handleSave(lavorazioneAggiornata);
    } catch (error) {
      console.error(`Errore durante il completamento della fase ${fase}:`, error);
      throw error;
    }
  }, [lavorazione, actions]);
  
  // Aggiorna una fase di assemblaggio
  const updateFase = useCallback(async (fase: string, dati: Partial<FaseAssemblaggio>) => {
    if (!lavorazione) return;
    
    try {
      const lavorazioneAggiornata = { ...lavorazione };
      
      // Inizializza assemblaggio se non esiste
      if (!lavorazioneAggiornata.assemblaggio) {
        lavorazioneAggiornata.assemblaggio = {};
      }
      
      // Aggiorna la fase specifica preservando lo stato attuale
      const statoCorrente = lavorazioneAggiornata.assemblaggio[fase]?.stato || StatoAssemblaggio.NON_INIZIATA;
      
      lavorazioneAggiornata.assemblaggio[fase] = {
        ...lavorazioneAggiornata.assemblaggio[fase],
        ...dati,
        stato: statoCorrente
      };
      
      await actions.handleSave(lavorazioneAggiornata);
    } catch (error) {
      console.error(`Errore durante l'aggiornamento della fase ${fase}:`, error);
      throw error;
    }
  }, [lavorazione, actions]);
  
  return {
    lavorazione,
    assemblaggio,
    loading,
    operatori,
    activePhase,
    setActivePhase,
    startFase,
    completeFase,
    updateFase
  };
};
