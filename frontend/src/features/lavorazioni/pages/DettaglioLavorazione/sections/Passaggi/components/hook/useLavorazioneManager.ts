import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLavorazioneContext } from '../../../../../../store/LavorazioneContext';
import { PassaggioLavorazione, QuantityType } from '../../../../../../types/models.types';
import { EventType, LavorazioneEvent } from '../../types/lavorazioni.types';

// Definiamo interfacce estese per gestire i campi mancanti
interface ExtendedLavorazione {
  passaggiLavorazione?: PassaggioLavorazione[];
  eventi?: LavorazioneEvent[];
}

interface ExtendedPassaggioOperazione {
  oraInizio?: Date;
  oraFine?: Date;
  operatore?: string;
  isStarted: boolean;
  isCompleted: boolean;
  note?: string;
}

export const useLavorazioniManager = () => {
  const {
    data: { lavorazione, collections },
    loadingStates: { operations: isLoading },
    actions
  } = useLavorazioneContext();
  
  // Stato locale per i passaggi di lavorazione
  const [passaggiLavorazione, setPassaggiLavorazione] = useState<PassaggioLavorazione[]>([]);
  const [eventi, setEventi] = useState<LavorazioneEvent[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  
  // Utility per ottenere il titolo di un passaggio
  const getTitoloPassaggio = useCallback((tipo: string): string => {
    switch (tipo) {
      case 'pelaturaMondatura':
        return 'Pelatura e Mondatura';
      case 'lavaggioPulizia':
        return 'Lavaggio e Pulizia';
      case 'taglioMacinaAffetta':
        return 'Taglio, Macina e Affetta';
      default:
        return 'Passaggio sconosciuto';
    }
  }, []);
  
  // Effetto per inizializzare i passaggi dalla lavorazione
  useEffect(() => {
    if (lavorazione) {
      if (lavorazione.passaggiLavorazione && lavorazione.passaggiLavorazione.length > 0) {
        setPassaggiLavorazione(lavorazione.passaggiLavorazione);
        
        // Inizializza gli eventi se presenti nella lavorazione
        const extendedLavorazione = lavorazione as ExtendedLavorazione;
        if (extendedLavorazione.eventi && Array.isArray(extendedLavorazione.eventi)) {
          setEventi(extendedLavorazione.eventi);
        }
      } else {
        // Se non ci sono passaggi, ne creiamo uno di default
        const defaultPassaggio: PassaggioLavorazione = {
          id: `passaggio_${Date.now()}`,
          pelaturaMondatura: {
            isStarted: false,
            isCompleted: false
          },
          lavaggioPulizia: {
            isStarted: false,
            isCompleted: false
          },
          taglioMacinaAffetta: {
            isStarted: false,
            isCompleted: false
          }
        };
        setPassaggiLavorazione([defaultPassaggio]);
      }
    }
  }, [lavorazione]);
  
  // Estrai gli operatori dalle collezioni
  const operatori = useMemo(() => 
    collections?.quantityTypes as QuantityType[] || [], 
  [collections?.quantityTypes]);
  
  // Calcola la percentuale di completamento
  const completionPercentage = useMemo(() => {
    if (passaggiLavorazione.length === 0) return 0;
    
    let totalSteps = 0;
    let completedSteps = 0;
    
    passaggiLavorazione.forEach(passaggio => {
      // Conta pelaturaMondatura se definito
      if (passaggio.pelaturaMondatura) {
        totalSteps++;
        if (passaggio.pelaturaMondatura.isCompleted) {
          completedSteps++;
        }
      }
      
      // Conta lavaggioPulizia se definito
      if (passaggio.lavaggioPulizia) {
        totalSteps++;
        if (passaggio.lavaggioPulizia.isCompleted) {
          completedSteps++;
        }
      }
      
      // Conta taglioMacinaAffetta se definito
      if (passaggio.taglioMacinaAffetta) {
        totalSteps++;
        if (passaggio.taglioMacinaAffetta.isCompleted) {
          completedSteps++;
        }
      }
    });
    
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  }, [passaggiLavorazione]);
  
  // Funzione per aggiungere un evento
  const addEvent = useCallback((event: LavorazioneEvent) => {
    setEventi(prev => [event, ...prev]);
  }, []);
  
  // Avvia un passaggio
  const handleStartPassaggio = useCallback((
    passaggioId: string,
    tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta'
  ) => {
    setPassaggiLavorazione(prev => prev.map(p => {
      if (p.id === passaggioId) {
        const passaggio = {...p};
        if (passaggio[tipo]) {
          const operatore = passaggio[tipo]?.operatore || '';
          
          passaggio[tipo] = {
            ...passaggio[tipo],
            isStarted: true,
            oraInizio: new Date() // Uso di Date invece di string
          };
          
          // Aggiungi evento
          addEvent({
            type: EventType.START,
            timestamp: new Date().toISOString(),
            passaggioId,
            tipoPassaggio: tipo,
            operatore,
            description: `Fase "${getTitoloPassaggio(tipo)}" avviata da ${operatore || 'operatore non specificato'}`
          });
        }
        return passaggio;
      }
      return p;
    }));
    setIsDirty(true);
  }, [addEvent, getTitoloPassaggio]);
  
  // Completa un passaggio
  const handleCompletePassaggio = useCallback((
    passaggioId: string,
    tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta'
  ) => {
    setPassaggiLavorazione(prev => prev.map(p => {
      if (p.id === passaggioId) {
        const passaggio = {...p};
        if (passaggio[tipo]) {
          const operatore = passaggio[tipo]?.operatore || '';
          
          passaggio[tipo] = {
            ...passaggio[tipo],
            isCompleted: true,
            oraFine: new Date() // Uso di Date invece di string
          };
          
          // Aggiungi evento
          addEvent({
            type: EventType.COMPLETE,
            timestamp: new Date().toISOString(),
            passaggioId,
            tipoPassaggio: tipo,
            operatore,
            description: `Fase "${getTitoloPassaggio(tipo)}" completata da ${operatore || 'operatore non specificato'}`
          });
        }
        return passaggio;
      }
      return p;
    }));
    setIsDirty(true);
  }, [addEvent, getTitoloPassaggio]);
  
  // Cambia l'operatore di un passaggio
  const handleChangeOperatore = useCallback((
    passaggioId: string,
    tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta',
    operatore: string
  ) => {
    setPassaggiLavorazione(prev => prev.map(p => {
      if (p.id === passaggioId) {
        const passaggio = {...p};
        if (passaggio[tipo]) {
          const oldOperatore = passaggio[tipo]?.operatore || '';
          
          passaggio[tipo] = {
            ...passaggio[tipo],
            operatore
          };
          
          // Aggiungi evento solo se c'è stato un cambio di operatore
          if (oldOperatore && oldOperatore !== operatore) {
            addEvent({
              type: EventType.CHANGE_OPERATOR,
              timestamp: new Date().toISOString(),
              passaggioId,
              tipoPassaggio: tipo,
              operatore,
              description: `Operatore per "${getTitoloPassaggio(tipo)}" cambiato da ${oldOperatore} a ${operatore}`
            });
          }
        }
        return passaggio;
      }
      return p;
    }));
    setIsDirty(true);
  }, [addEvent, getTitoloPassaggio]);
  
  // Aggiungi nota a un passaggio
  const handleAddNote = useCallback((
    passaggioId: string,
    tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta',
    note: string
  ) => {
    setPassaggiLavorazione(prev => prev.map(p => {
      if (p.id === passaggioId) {
        const passaggio = {...p};
        if (passaggio[tipo]) {
          const operatore = passaggio[tipo]?.operatore || '';
          const existingPassaggio = passaggio[tipo] as ExtendedPassaggioOperazione;
          const existingNote = existingPassaggio.note || '';
          
          // Aggiungi o aggiorna la nota usando type assertion
          passaggio[tipo] = {
            ...passaggio[tipo],
            note: existingNote
              ? `${existingNote}\n\n${new Date().toLocaleString()}: ${note}`
              : `${new Date().toLocaleString()}: ${note}`
          } as ExtendedPassaggioOperazione;
          
          // Aggiungi evento
          addEvent({
            type: EventType.NOTE,
            timestamp: new Date().toISOString(),
            passaggioId,
            tipoPassaggio: tipo,
            operatore,
            description: `Aggiunta nota a "${getTitoloPassaggio(tipo)}" ${operatore ? `da ${operatore}` : ''}`,
            note
          });
        }
        return passaggio;
      }
      return p;
    }));
    setIsDirty(true);
  }, [addEvent, getTitoloPassaggio]);
  
  // Salva i passaggi
  const handleSavePassaggi = useCallback(async () => {
    if (!lavorazione) return;
    
    try {
      actions.setLoading('operations', true);
      
      // Prima salva i passaggi standard
      await actions.handleSave({
        ...lavorazione,
        passaggiLavorazione
      });
      
      // Poi salva gli eventi usando un'estensione del modello lavorazione
      // Nota: questo potrebbe richiedere un endpoint API separato o una soluzione diversa
      // basata su come gli eventi vengono gestiti nel backend
      console.log('Eventi da salvare:', eventi);
      
      setIsDirty(false);
    } catch (error) {
      console.error('Errore durante il salvataggio dei passaggi:', error);
    } finally {
      actions.setLoading('operations', false);
    }
  }, [lavorazione, passaggiLavorazione, eventi, actions]);

  return {
    passaggiLavorazione,
    operatori,
    eventi,
    isDirty,
    isLoading,
    completionPercentage,
    handleStartPassaggio,
    handleCompletePassaggio,
    handleChangeOperatore,
    handleAddNote,
    handleSavePassaggi
  };
};
