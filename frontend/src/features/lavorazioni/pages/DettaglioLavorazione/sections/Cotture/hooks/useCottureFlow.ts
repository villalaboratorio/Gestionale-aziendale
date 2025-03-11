
import { useState, useCallback, useMemo } from 'react';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { StatoCottura } from '../../../../../types/models.types';

/**
 * Hook per gestire il flusso delle cotture (avvio, interruzione, completamento)
 */
export const useCottureFlow = () => {
  // Recupera contesto e dati
  const {
    data: { lavorazione },
    actions
  } = useLavorazioneContext();

  // Stati locali
  const [showInterruptModal, setShowInterruptModal] = useState(false);
  const [cotturaToInterrupt, setCotturaToInterrupt] = useState<string | null>(null);
  
  // Cotture dalla lavorazione - usando useMemo per evitare warning react-hooks/exhaustive-deps
  const cotture = useMemo(() => lavorazione?.cotture || [], [lavorazione]);
  
  // Gestione dell'avvio di una cottura
  const handleStartCottura = useCallback((cotturaId: string) => {
    if (!lavorazione) return;
    
    try {
      // Cerchiamo la cottura da avviare per debugging
      const cotturaToStart = cotture.find(c => c._id === cotturaId);
      if (!cotturaToStart) {
        console.error(`Cottura non trovata con ID: ${cotturaId}`);
        return;
      }
      
      console.log('Avvio cottura (solo stato locale):', cotturaToStart);
      
      // Creazione copia profonda dello stato lavorazione per evitare modifiche accidentali
      const updatedLavorazione = JSON.parse(JSON.stringify(lavorazione));
      
      // Aggiorniamo le cotture nella copia
      updatedLavorazione.cotture = updatedLavorazione.cotture.map((c: any) => {
        if (c._id === cotturaId) {
          return {
            ...c,
            stato: StatoCottura.IN_CORSO,
            inizio: new Date().toISOString()
          };
        }
        return c;
      });
      
      // Aggiorniamo lo stato locale senza salvare al backend
      actions.updateState({
        lavorazione: updatedLavorazione,
        isDirty: true  // Importante: marchiamo come "dirty" per avvisare che ci sono modifiche non salvate
      });
      
      // Mostriamo un promemoria per salvare
      console.log('✅ Cottura avviata localmente! Ricordati di salvare le modifiche.');
      
      // Sostituiamo l'alert con un elemento visivo non bloccante (gestito dal componente CotturaTab)
      // Il ritardo nell'alert permette all'UI di aggiornarsi prima
      setTimeout(() => {
        // Messaggio meno invasivo che non blocca l'interfaccia
        const event = new CustomEvent('app:notification', { 
          detail: { message: 'Cottura avviata! Ricordati di salvare le modifiche.', type: 'warning' } 
        });
        window.dispatchEvent(event);
      }, 100);
      
    } catch (error) {
      console.error('Errore durante l\'avvio della cottura:', error);
      actions.setError('operations', 'Errore durante l\'avvio della cottura');
    }
  }, [lavorazione, cotture, actions]);
  
  // Gestione della richiesta di interruzione di una cottura - INVARIATO
  const handleRequestInterrupt = useCallback((cotturaId: string) => {
    setCotturaToInterrupt(cotturaId);
    setShowInterruptModal(true);
  }, []);
  
  // Gestione dell'interruzione effettiva di una cottura
  const handleInterruptCottura = useCallback((motivazione: string) => {
    if (!lavorazione || !cotturaToInterrupt) return;
    
    try {
      // Creazione copia profonda dello stato per sicurezza
      const updatedLavorazione = JSON.parse(JSON.stringify(lavorazione));
      
      // Aggiorniamo le cotture nella copia
      updatedLavorazione.cotture = updatedLavorazione.cotture.map((c: any) => {
        if (c._id === cotturaToInterrupt) {
          return {
            ...c,
            stato: StatoCottura.COMPLETATA,
            fine: new Date().toISOString(),
            noteInterruzione: motivazione
          };
        }
        return c;
      });
      
      // Aggiorniamo lo stato locale senza salvare al backend
      actions.updateState({
        lavorazione: updatedLavorazione,
        isDirty: true  // Marchiamo come "dirty"
      });
      
      // Reset dello stato del modal
      setShowInterruptModal(false);
      setCotturaToInterrupt(null);
      
      // Promemoria per salvare
      console.log('✅ Cottura interrotta localmente! Ricordati di salvare le modifiche.');
      
      // Notifica non bloccante
      setTimeout(() => {
        const event = new CustomEvent('app:notification', { 
          detail: { message: 'Cottura interrotta! Ricordati di salvare le modifiche.', type: 'warning' } 
        });
        window.dispatchEvent(event);
      }, 100);
      
    } catch (error) {
      console.error('Errore durante l\'interruzione della cottura:', error);
      actions.setError('operations', 'Errore durante l\'interruzione della cottura');
    }
  }, [lavorazione, cotturaToInterrupt, actions]);
  
  // Gestione del completamento di una cottura
  const handleCompleteCottura = useCallback((cotturaId: string, temperaturaFinale?: number) => {
    if (!lavorazione) return;
    
    try {
      // Creazione copia profonda dello stato per sicurezza
      const updatedLavorazione = JSON.parse(JSON.stringify(lavorazione));
      
      // Aggiorniamo le cotture nella copia
      updatedLavorazione.cotture = updatedLavorazione.cotture.map((c: any) => {
        if (c._id === cotturaId) {
          return {
            ...c,
            stato: StatoCottura.COMPLETATA,
            fine: new Date().toISOString(),
            temperaturaFinale: temperaturaFinale || c.temperatura
          };
        }
        return c;
      });
      
      // Aggiorniamo lo stato locale senza salvare al backend
      actions.updateState({
        lavorazione: updatedLavorazione,
        isDirty: true  // Marchiamo come "dirty"
      });
      
      // Promemoria per salvare
      console.log('✅ Cottura completata localmente! Ricordati di salvare le modifiche.');
      
      // Notifica non bloccante
      setTimeout(() => {
        const event = new CustomEvent('app:notification', { 
          detail: { message: 'Cottura completata! Ricordati di salvare le modifiche.', type: 'warning' } 
        });
        window.dispatchEvent(event);
      }, 100);
      
    } catch (error) {
      console.error('Errore durante il completamento della cottura:', error);
      actions.setError('operations', 'Errore durante il completamento della cottura');
    }
  }, [lavorazione, actions]);

  // Restituisci le funzioni e gli stati necessari
  return {
    // Stati
    showInterruptModal,
    cotturaToInterrupt,
    
    // Setter per gli stati
    setShowInterruptModal,
    setCotturaToInterrupt,
    
    // Funzioni di azione
    handleStartCottura,
    handleRequestInterrupt,
    handleInterruptCottura,
    handleCompleteCottura
  };
};
