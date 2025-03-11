/** @jsxRuntime classic */
/** @jsx React.createElement */

import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lavorazione, InitialCollections, LavorazioneState, LoadingState, ErrorState } from '../types';
import { lavorazioneService } from '../services/lavorazione.service';
import { eventBus } from '../../../core/events/event.bus';
import {  StatoCottura } from '../types/models.types';
interface LavorazioneContextValue {
  data: {
    lavorazione: Lavorazione | null;
    collections: InitialCollections | null;
  };
  loadingStates: LoadingState;
  error: ErrorState;
  activeTab: string;
  isNew: boolean;
  actions: {
    fetchData: (id: string) => Promise<void>;
    handleSave: (data: Partial<Lavorazione>) => Promise<Lavorazione>;
    handleDelete: (id: string) => Promise<void>;
    setActiveTab: (tab: string) => void;
    markTabDirty: (tab: string) => void;
    markTabValid: (tab: string) => void;
    updateState: (updates: Partial<LavorazioneState>) => void;
    setError: (key: keyof ErrorState, error: string | null) => void;
    setLoading: (key: keyof LoadingState, value: boolean) => void;
    refreshCollections: () => Promise<void>; // Nuova azione per aggiornare solo le collezioni
  };
}

const initialState: LavorazioneState = {
  lavorazione: null,
  collections: null,
  loading: {
    main: false,
    operations: false,
    tabs: {}
  },
  error: {
    main: null,
    operations: null,
    tabs: {}
  },
  isDirty: false
};

const LavorazioneContext = React.createContext<LavorazioneContextValue | undefined>(undefined);

export const LavorazioneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('info');
  const [state, setState] = React.useState<LavorazioneState>(initialState);

  // Funzione per caricare solo le collezioni
  const fetchCollections = React.useCallback(async (forceRefresh = false): Promise<InitialCollections | null> => {
    console.log('📚 Fetching collections data', forceRefresh ? '(forced refresh)' : '');
    
    try {
      const collectionsResponse = await lavorazioneService.getCollections(forceRefresh);
      
      if (!collectionsResponse.success) {
        console.warn('❌ Failed to load collections:', collectionsResponse.message);
        return null;
      }
      
      // Log dettagliato delle collezioni per diagnostica
      const collections = collectionsResponse.data;
      console.log('✅ Collections fetched successfully:', {
        clienti: collections.clienti?.length || 0,
        ricette: collections.ricette?.length || 0,
        tipiLavorazione: collections.tipiLavorazione?.length || 0,
        statiLavorazione: collections.statiLavorazione?.length || 0,
        quantityTypes: collections.quantityTypes?.length || 0,
        tipiCottura: collections.tipiCottura?.length || 0
      });
      
      // Verifica delle collezioni critiche
      if (!collections.quantityTypes || collections.quantityTypes.length === 0) {
        console.warn('⚠️ quantityTypes collection is empty or missing - operatori might not be available');
      }
      
      if (!collections.tipiCottura || collections.tipiCottura.length === 0) {
        console.warn('⚠️ tipiCottura collection is empty or missing');
      }

      // Verifica ricette con cotture
      const ricettesWithCotture = collections.ricette?.filter(r => r.cotture && r.cotture.length > 0);
      console.log(`📊 Ricette con cotture predefinite: ${ricettesWithCotture?.length || 0}/${collections.ricette?.length || 0}`);
      
      return collections;
    } catch (error) {
      console.error('❌ Error fetching collections:', error);
      return null;
    }
  }, []);

  // Nuova azione per aggiornare solo le collezioni
  const refreshCollections = React.useCallback(async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, operations: true }
    }));

    try {
      const collections = await fetchCollections(true); // Force refresh
      
      setState(prev => ({
        ...prev,
        collections,
        loading: { ...prev.loading, operations: false }
      }));
      
      console.log('🔄 Collections refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing collections:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, operations: false }
      }));
    }
  }, [fetchCollections]);

  // Funzione per caricare sia la lavorazione che le collezioni necessarie
  const fetchData = React.useCallback(async (lavorazioneId: string): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, main: true },
      error: { ...prev.error, main: null } // Reset error on new fetch
    }));

    try {
      console.log(`🔍 Fetching lavorazione data for ID: ${lavorazioneId}`);
      
      // Eseguiamo le chiamate in parallelo per velocizzare il caricamento
      const [lavorazioneResponse, collections] = await Promise.all([
        lavorazioneService.getLavorazione(lavorazioneId),
        fetchCollections()
      ]);
      
      if (!lavorazioneResponse.success) {
        throw new Error(lavorazioneResponse.message || 'Errore nel caricamento della lavorazione');
      }
      
      // Verifica che la lavorazione abbia la ricetta popolata correttamente
      const lavorazione = lavorazioneResponse.data;
      if (!lavorazione.ricetta) {
        console.warn('⚠️ Lavorazione loaded without ricetta: default cooking data won\'t be available');
      } else if (lavorazione.ricetta.cotture && lavorazione.ricetta.cotture.length > 0) {
        console.log(`🍳 Ricetta has ${lavorazione.ricetta.cotture.length} default cooking settings`);
      }
      
      // Aggiorniamo lo stato con entrambi i set di dati
      setState(prev => ({
        ...prev,
        lavorazione,
        collections,
        loading: { ...prev.loading, main: false }
      }));
      
      console.log('✅ State updated with lavorazione and collections');
      eventBus.emit('lavorazione:loaded', { id: lavorazioneId });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      console.error('❌ Error in fetchData:', error);
      setState(prev => ({
        ...prev,
        error: { ...prev.error, main: errorMessage },
        loading: { ...prev.loading, main: false }
      }));
    }
  }, [fetchCollections]);

  const handleSave = React.useCallback(async (data: Partial<Lavorazione> = {}): Promise<Lavorazione> => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, operations: true },
      error: { ...prev.error, operations: null }
    }));
  
    try {
      console.log('💾 Saving lavorazione data:', { id, isNew: !id || id === 'new', dataObj: data });
      
      // Helper per estrarre ID da oggetti in modo sicuro
      const extractId = (obj: any): string | undefined => {
        if (!obj) return undefined;
        if (typeof obj === 'string') return obj;
        if (typeof obj === 'object' && obj._id) return obj._id;
        return undefined;
      };
      
      // Se data è vuoto, usa la lavorazione corrente come fallback
      if (!data || Object.keys(data).length === 0) {
        console.warn('⚠️ Dati vuoti passati a handleSave, uso la lavorazione corrente');
        if (state.lavorazione) {
          data = state.lavorazione;
        } else {
          throw new Error('Nessun dato disponibile per il salvataggio');
        }
      }
      
      // Cloniamo i dati per non modificare l'originale - crea una deep copy
      let dataToSave;
      try {
        dataToSave = JSON.parse(JSON.stringify(data));
        console.log('Data dopo deep copy:', dataToSave);
      } catch (err) {
        console.error('Errore durante la deep copy:', err);
        // Fallback: usa una copia semplice
        dataToSave = { ...data };
      }
      
      // Verifica che la copia non sia vuota
      if (!dataToSave || Object.keys(dataToSave).length === 0) {
        console.error('⚠️ ERRORE: Payload vuoto dopo deep copy, uso dati originali');
        dataToSave = { ...data };
      }
      
      // Assicuriamoci che i campi principali siano copiati correttamente
      const fieldsToCopy = [
        'numeroScheda', 'noteProduzione', 'noteAllergeni', 
        'noteConfezionamento', 'isUrgente', 'motivazioneUrgenza', 
        'dataConsegnaPrevista', 'prioritaCliente', 'operatore'
      ];
      
      fieldsToCopy.forEach(field => {
        if (data[field] !== undefined && dataToSave[field] === undefined) {
          dataToSave[field] = data[field];
        }
      });
      
      // Normalizza tutti i riferimenti che potrebbero essere oggetti completi
      // invece di semplici ID come richiesto dall'API
      dataToSave.ricetta = extractId(dataToSave.ricetta);
      dataToSave.cliente = extractId(dataToSave.cliente);
      dataToSave.tipoLavorazione = extractId(dataToSave.tipoLavorazione);
      dataToSave.statoLavorazione = extractId(dataToSave.statoLavorazione);
      
      // Se abbiamo cotture, prepariamole per il backend
      if (dataToSave.cotture && Array.isArray(dataToSave.cotture)) {
        console.log('Cotture before processing:', dataToSave.cotture.length);
        
        // Filtriamo eventuali valori null o undefined
        const filteredCotture = dataToSave.cotture.filter(c => c !== null && c !== undefined);
        console.log('Cotture after null filtering:', filteredCotture.length);
        
        // Funzione per convertire lo stato enum in stringa
        const mapStatoToString = (stato: StatoCottura): string => {
          switch(stato) {
            case StatoCottura.IN_CORSO: return 'in_corso';
            case StatoCottura.COMPLETATA: return 'completata';
            default: return 'non_iniziata';
          }
        };
        
        // Trasforma le cotture per rispettare lo schema del backend
        const cottureForBackend = filteredCotture.map((cottura, index) => {
          console.log(`Processing cottura[${index}]:`, cottura);
          
          // Crea un nuovo oggetto base con i campi obbligatori
          const baseData: Record<string, any> = {
            // Mantieni _id solo se non è un ID temporaneo
            ...((cottura._id && !String(cottura._id).startsWith('temp_')) 
                ? { _id: cottura._id } 
                : {}),
            
            // Converti tipoCottura in ObjectId
            tipoCottura: extractId(cottura.tipoCottura),
            
            // Gestione temperatura
            temperaturaTarget: cottura.temperaturaTarget || cottura.temperatura || 0,
            
            // Assicurati che l'addetto sia una stringa
            addetto: cottura.addetto || '',
            
            // Converti lo stato enum in stringa per il backend
            stato: mapStatoToString(cottura.stato),
            
            // Aggiungi sempre il tempo cottura, con fallback a 0
            tempoCottura: cottura.tempoCottura || 0
          };
          
          // Aggiungi i campi opzionali solo se presenti
          if (cottura.inizio) baseData.inizio = cottura.inizio;
          if (cottura.fine) baseData.fine = cottura.fine;
          if (cottura.temperaturaFinale) baseData.temperaturaFinale = cottura.temperaturaFinale;
          if (cottura.verificatoDa) baseData.verificatoDa = cottura.verificatoDa;
          if (cottura.noteInterruzione) baseData.noteInterruzione = cottura.noteInterruzione;
          
          return baseData;
        });
        
        console.log('Sanitized cotture ready for save:', cottureForBackend.length);
        
        // Assegna le cotture formattate al dataToSave
        dataToSave.cotture = cottureForBackend;
      }
      
      console.log('Preparing to save with sanitized data');
      
      // Verifica finale che il payload non sia vuoto
      if (!dataToSave || Object.keys(dataToSave).length === 0) {
        console.error('⚠️ ERRORE CRITICO: Payload vuoto prima dell\'invio!');
        throw new Error('Payload vuoto: impossibile salvare');
      }
      
      // Stampa il payload JSON completo per debug
      console.log('PAYLOAD JSON:', JSON.stringify(dataToSave, null, 2));
      
      // Salva i dati
      const response = id && id !== 'new'
        ? await lavorazioneService.updateLavorazione(id, dataToSave)
        : await lavorazioneService.createLavorazione(dataToSave);
      
      // Verifica se la risposta è stata un successo
      if (!response.success) {
        throw new Error(`Errore dal server: ${response.message}`);
      }
      
      console.log('✅ Lavorazione saved successfully:', response.data._id);
  
      setState(prev => ({
        ...prev,
        lavorazione: response.data,
        loading: { ...prev.loading, operations: false },
        isDirty: false
      }));
  
      eventBus.emit('lavorazione:saved', { id: response.data._id });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il salvataggio';
      console.error('❌ Error saving lavorazione:', error);
      setState(prev => ({
        ...prev,
        error: { ...prev.error, operations: errorMessage },
        loading: { ...prev.loading, operations: false }
      }));
      throw error;
    }
  }, [id, state.lavorazione]);
  
  
  
  

  const handleDelete = React.useCallback(async (lavorazioneId: string): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, operations: true },
      error: { ...prev.error, operations: null } // Reset error on delete
    }));

    try {
      console.log('🗑️ Deleting lavorazione:', lavorazioneId);
      await lavorazioneService.deleteLavorazione(lavorazioneId);
      
      console.log('✅ Lavorazione deleted successfully');
      eventBus.emit('lavorazione:deleted', { id: lavorazioneId });
      navigate('/v2/lavorazioni'); // Assicurati che il percorso sia corretto
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'eliminazione';
      console.error('❌ Error deleting lavorazione:', error);
      setState(prev => ({
        ...prev,
        error: { ...prev.error, operations: errorMessage },
        loading: { ...prev.loading, operations: false }
      }));
      throw error;
    }
  }, [navigate]);

  const value = React.useMemo((): LavorazioneContextValue => ({
    data: {
      lavorazione: state.lavorazione,
      collections: state.collections
    },
    loadingStates: state.loading,
    error: state.error,
    activeTab,
    isNew: !id || id === 'new',
    actions: {
      fetchData,
      handleSave,
      handleDelete,
      refreshCollections,
      setActiveTab,
      markTabDirty: (tab: string) => {
        setState(prev => ({
          ...prev,
          isDirty: true,
          loading: { ...prev.loading, tabs: { ...prev.loading.tabs, [tab]: true } }
        }));
      },
      markTabValid: (tab: string) => {
        setState(prev => ({
          ...prev,
          loading: { ...prev.loading, tabs: { ...prev.loading.tabs, [tab]: false } }
        }));
      },
      updateState: (updates: Partial<LavorazioneState>) => {
        setState(prev => ({ ...prev, ...updates }));
      },
      setError: (key: keyof ErrorState, error: string | null) => {
        setState(prev => ({
          ...prev,
          error: { ...prev.error, [key]: error }
        }));
      },
      setLoading: (key: keyof LoadingState, value: boolean) => {
        setState(prev => ({
          ...prev,
          loading: { ...prev.loading, [key]: value }
        }));
      }
    }
  }), [state, activeTab, id, fetchData, handleSave, handleDelete, refreshCollections]);

  return (
    <LavorazioneContext.Provider value={value}>
      {children}
    </LavorazioneContext.Provider>
  );
};

export const useLavorazioneContext = () => {
  const context = React.useContext(LavorazioneContext);
  if (!context) {
    throw new Error('useLavorazioneContext deve essere usato dentro LavorazioneProvider');
  }
  return context;
};

export default LavorazioneContext;
