import { useCallback } from 'react';
import { usePianificazione } from './usePianificazione';
import { ILavorazioneParcheggiata } from '../types/lavorazioni.types';
import { v4 as uuidv4 } from 'uuid';
import { serviceContainer } from '../../../core/services/service.container';
import { eventBus } from '../../../core/events/event.bus';
import { logger } from '../../../core/Path/logging/logger';

// Interfacce per i servizi utilizzati
interface IStorageService {
  saveDraft: (lavorazioni: ILavorazioneParcheggiata[]) => void;
  createBackup: <T>(key: string, data: T) => void;
    clearStorage: () => void;
}

/**
 * Hook per le azioni relative alle lavorazioni parcheggiate
 */
export const useLavorazioniActions = () => {
  const { state, dispatch } = usePianificazione();
  const lavorazioniParcheggiate = state.lavorazioni.parcheggiate;
  
  // Funzione ausiliaria per calcolare il tracking delle quantità
  const getQuantityTracking = useCallback((materiaPrimaId: string) => {
    if (!materiaPrimaId) {
      return { totale: 0, allocata: 0, disponibile: 0 };
    }
    
    const materiaPrima = state.materiePrime.items.find(mp => mp._id === materiaPrimaId);
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
  }, [state.materiePrime.items, lavorazioniParcheggiate]);
  
  /**
   * Aggiunge una nuova lavorazione
   */
  const addLavorazione = useCallback(
    async (lavorazione: Partial<ILavorazioneParcheggiata>): Promise<ILavorazioneParcheggiata> => {
      // Validazione campi obbligatori
      if (!lavorazione.ricettaId || !lavorazione.materiaPrima?.id || !lavorazione.quantitaTotale) {
        throw new Error('Dati lavorazione incompleti');
      }
      
      // Verifica che ci siano porzioniPreviste e grammiPerPorzione
      if (!lavorazione.porzioniPreviste || !lavorazione.grammiPerPorzione) {
        logger.warn('Porzioni o grammi per porzione mancanti, verranno calcolati');
      }
      
      // Verifica disponibilità quantità
      const tracking = getQuantityTracking(lavorazione.materiaPrima.id);
      if (lavorazione.quantitaTotale > tracking.disponibile) {
        throw new Error(`Quantità richiesta (${lavorazione.quantitaTotale}kg) superiore alla disponibilità (${tracking.disponibile}kg)`);
      }
      
      // Calcola porzioni e grammi per porzione se mancanti
      const grammiPerPorzione = lavorazione.grammiPerPorzione || 100; // default
      const porzioniPreviste = lavorazione.porzioniPreviste || 
        Math.floor((lavorazione.quantitaTotale * 1000) / grammiPerPorzione);
      
      // Creazione nuova lavorazione
      const nuovaLavorazione: ILavorazioneParcheggiata = {
        id: uuidv4(),
        ricettaId: lavorazione.ricettaId,
        ricettaNome: lavorazione.ricettaNome || '',
        materiaPrima: {
          id: lavorazione.materiaPrima.id,
          nome: lavorazione.materiaPrima.nome || '',
          lotNumber: lavorazione.materiaPrima.lotNumber || ''
        },
        quantitaTotale: lavorazione.quantitaTotale,
        porzioniPreviste: porzioniPreviste,
        grammiPerPorzione: grammiPerPorzione,
        cliente: lavorazione.cliente || '',
        clienteId: lavorazione.clienteId || '',
        dataCreazione: new Date().toISOString(),
        operatore: lavorazione.operatore || 'Sistema', // Aggiunto campo operatore
        note: lavorazione.note || ''
      };
      
      // Aggiorna lo stato
      dispatch({ type: 'ADD_LAVORAZIONE', payload: nuovaLavorazione });
      
      // Persisti in storage
      try {
        const storageService = serviceContainer.get('storageService') as IStorageService;
        storageService.saveDraft([...lavorazioniParcheggiate, nuovaLavorazione]);
        
        eventBus.emit('LAVORAZIONE_ADDED', { lavorazione: nuovaLavorazione });
        logger.info(`Aggiunta lavorazione: ${nuovaLavorazione.ricettaNome} per ${nuovaLavorazione.materiaPrima.nome}`);
        
        return nuovaLavorazione;
      } catch (error) {
        logger.error('Errore nel salvataggio della lavorazione', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [dispatch, lavorazioniParcheggiate, getQuantityTracking]
  );
  
  /**
   * Aggiorna una lavorazione esistente
   */
  const updateLavorazione = useCallback(
    async (id: string, updatedData: Partial<ILavorazioneParcheggiata>): Promise<void> => {
      // Trova la lavorazione esistente
      const lavorazione = lavorazioniParcheggiate.find(l => l.id === id);
      if (!lavorazione) {
        throw new Error('Lavorazione non trovata');
      }
      
      // Se viene aggiornata la quantità, verifica la disponibilità
      if (updatedData.quantitaTotale && updatedData.quantitaTotale !== lavorazione.quantitaTotale) {
        const tracking = getQuantityTracking(lavorazione.materiaPrima.id);
        const disponibileConAttuale = tracking.disponibile + lavorazione.quantitaTotale;
        
        if (updatedData.quantitaTotale > disponibileConAttuale) {
          throw new Error(`Quantità richiesta (${updatedData.quantitaTotale}kg) superiore alla disponibilità (${disponibileConAttuale}kg)`);
        }
      }
      
      // Se vengono aggiornate porzioni o grammi, ricalcola la quantità
      if (updatedData.porzioniPreviste && updatedData.grammiPerPorzione) {
        // Calcola nuova quantità totale basata su porzioni e grammi
        const nuovaQuantitaTotale = (updatedData.porzioniPreviste * updatedData.grammiPerPorzione) / 1000;
        updatedData.quantitaTotale = nuovaQuantitaTotale;
        
        logger.debug(`Ricalcolata quantità: ${nuovaQuantitaTotale}kg da ${updatedData.porzioniPreviste} porzioni di ${updatedData.grammiPerPorzione}g`);
      } else if (updatedData.porzioniPreviste && !updatedData.grammiPerPorzione) {
        // Aggiorna quantità basata su nuove porzioni e grammi esistenti
        const nuovaQuantitaTotale = (updatedData.porzioniPreviste * lavorazione.grammiPerPorzione) / 1000;
        updatedData.quantitaTotale = nuovaQuantitaTotale;
      } else if (!updatedData.porzioniPreviste && updatedData.grammiPerPorzione) {
        // Aggiorna quantità basata su porzioni esistenti e nuovi grammi
        const nuovaQuantitaTotale = (lavorazione.porzioniPreviste * updatedData.grammiPerPorzione) / 1000;
        updatedData.quantitaTotale = nuovaQuantitaTotale;
      } else if (updatedData.quantitaTotale && !updatedData.porzioniPreviste && !updatedData.grammiPerPorzione) {
        // Se viene aggiornata solo la quantità, ricalcola le porzioni
        updatedData.porzioniPreviste = Math.floor((updatedData.quantitaTotale * 1000) / lavorazione.grammiPerPorzione);
      }
      
      // Aggiorna la lavorazione con dataModifica
      const lavorazioneAggiornata = {
        ...lavorazione,
        ...updatedData,
        dataModifica: new Date().toISOString()
      };
      
      // Aggiorna lo stato
      dispatch({ 
        type: 'UPDATE_LAVORAZIONE', 
        payload: { id, updatedData: lavorazioneAggiornata } 
      });
      
      // Persisti in storage
      try {
        const storageService = serviceContainer.get('storageService') as IStorageService;
        const lavorazioniAggiornate = lavorazioniParcheggiate.map(l => 
          l.id === id ? lavorazioneAggiornata : l
        );
        
        storageService.saveDraft(lavorazioniAggiornate);
        
        eventBus.emit('LAVORAZIONE_UPDATED', { id, lavorazione: lavorazioneAggiornata });
        logger.info(`Aggiornata lavorazione: ${lavorazioneAggiornata.ricettaNome}`);
      } catch (error) {
        logger.error('Errore nell\'aggiornamento della lavorazione', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [dispatch, lavorazioniParcheggiate, getQuantityTracking]
  );
  
  /**
   * Rimuove una lavorazione
   */
  const removeLavorazione = useCallback(
    async (id: string): Promise<void> => {
      try {
        dispatch({ type: 'REMOVE_LAVORAZIONE', payload: id });
        
        // Aggiorna il localStorage
        const lavorazioniAggiornate = lavorazioniParcheggiate.filter(l => l.id !== id);
        const storageService = serviceContainer.get('storageService') as IStorageService;
        storageService.saveDraft(lavorazioniAggiornate);
        
        eventBus.emit('LAVORAZIONE_REMOVED', { id });
        logger.info(`Rimossa lavorazione con ID: ${id}`);
      } catch (error) {
        logger.error('Errore durante la rimozione della lavorazione', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [dispatch, lavorazioniParcheggiate]
  );
  
  /**
   * Cancella tutte le lavorazioni
   */
  const clearLavorazioni = useCallback(
    async (): Promise<void> => {
      try {
        // Prima crea un backup
        const storageService = serviceContainer.get('storageService') as IStorageService;
        if (lavorazioniParcheggiate.length > 0) {
          storageService.createBackup('lavorazioni', lavorazioniParcheggiate);
          logger.debug(`Creato backup di ${lavorazioniParcheggiate.length} lavorazioni`);
        }
        
        // Poi cancella
        dispatch({ type: 'CLEAR_LAVORAZIONI' });
        storageService.clearStorage();
        
        eventBus.emit('LAVORAZIONI_CLEARED', { count: lavorazioniParcheggiate.length });
        logger.info(`Cancellate ${lavorazioniParcheggiate.length} lavorazioni`);
      } catch (error) {
        logger.error('Errore durante la cancellazione delle lavorazioni', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [dispatch, lavorazioniParcheggiate]
  );
  
  /**
   * Prepara il payload per l'invio al backend
   */
  const prepareLavorazioniPayload = useCallback(() => {
    return lavorazioniParcheggiate.map(lav => ({
      ricettaId: lav.ricettaId,
      ricettaNome: lav.ricettaNome,
      materiaPrima: {
        id: lav.materiaPrima.id,
        nome: lav.materiaPrima.nome,
        lotNumber: lav.materiaPrima.lotNumber
      },
      quantitaTotale: lav.quantitaTotale,
      porzioniPreviste: lav.porzioniPreviste,
      grammiPerPorzione: lav.grammiPerPorzione,
      cliente: lav.cliente,
      clienteId: lav.clienteId,
      operatore: lav.operatore || 'Sistema',
      note: lav.note || '',
      dataConsegnaPrevista: lav.dataConsegnaPrevista || null,
      prioritaCliente: lav.prioritaCliente || 'media',
      isUrgente: lav.isUrgente || false
    }));
  }, [lavorazioniParcheggiate]);

  /**
   * Verifica se tutte le lavorazioni sono valide
   */
  const validateLavorazioni = useCallback(() => {
    // Verifica che ci siano lavorazioni
    if (lavorazioniParcheggiate.length === 0) {
      return { valid: false, message: 'Non ci sono lavorazioni da confermare' };
    }

    // Verifica che tutte le lavorazioni abbiano i campi obbligatori
    const invalidLavorazioni = lavorazioniParcheggiate.filter(lav => 
      !lav.ricettaId || 
      !lav.materiaPrima.id || 
      !lav.quantitaTotale || 
      !lav.porzioniPreviste || 
      !lav.grammiPerPorzione
    );

    if (invalidLavorazioni.length > 0) {
      return { 
        valid: false, 
        message: `${invalidLavorazioni.length} lavorazioni hanno dati incompleti`
      };
    }

    // Verifica che tutte le lavorazioni abbiano quantità valide
    const lowQuantityLavorazioni = lavorazioniParcheggiate.filter(lav => 
      lav.quantitaTotale <= 0 || 
      lav.porzioniPreviste <= 0 || 
      lav.grammiPerPorzione <= 0
    );

    if (lowQuantityLavorazioni.length > 0) {
      return { 
        valid: false, 
        message: `${lowQuantityLavorazioni.length} lavorazioni hanno quantità non valide`
      };
    }

    // Se arriviamo qui, tutte le lavorazioni sono valide
    return { valid: true };
  }, [lavorazioniParcheggiate]);

  /**
   * Gestisce la conferma e l'invio delle lavorazioni al backend
   */
  const confirmAndSendLavorazioni = useCallback(async () => {
    // Verifica validità
    const validationResult = validateLavorazioni();
    if (!validationResult.valid) {
      throw new Error(validationResult.message);
    }

    try {
      // Prepara il payload
      const payload = prepareLavorazioniPayload();
      
      // Log del payload per debug
      logger.debug('Payload lavorazioni: payload');

      // In un'applicazione reale, qui verrebbe fatta la chiamata API
      // const response = await lavorazioniApi.confirmLavorazioni(payload);
      
      // Clear delle lavorazioni dopo il successo
      await clearLavorazioni();
      
      eventBus.emit('LAVORAZIONI_CONFIRMED', { lavorazioni: payload });
      logger.info(`Confermate ${payload.length} lavorazioni`);
      
      return payload;
    } catch (error) {
      logger.error('Errore durante la conferma delle lavorazioni', 
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }, [validateLavorazioni, prepareLavorazioniPayload, clearLavorazioni]);

  return { 
    addLavorazione, 
    updateLavorazione, 
    removeLavorazione, 
    clearLavorazioni,
    prepareLavorazioniPayload,
    validateLavorazioni,
    confirmAndSendLavorazioni
  };
};
