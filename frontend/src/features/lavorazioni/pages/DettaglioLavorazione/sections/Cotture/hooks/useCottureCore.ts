import { useState, useCallback, useMemo } from 'react';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { Cottura } from '../../../../../types/models.types';
import { getTipoCotturaUtils } from '../../../../../utils/tipoCotturaUtils';

/**
 * Hook per gestire le operazioni base CRUD sulle cotture
 */
export const useCottureCore = () => {
  // Recupera contesto e dati
  const {
    data: { lavorazione, collections },
    loadingStates: { operations: saving },
    actions
  } = useLavorazioneContext();

  // Stati locali
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCottura, setSelectedCottura] = useState<Cottura | null>(null);
  
  // Recupero e normalizzazione dei tipi di cottura
  const tipiCottura = useMemo(() => {
    return getTipoCotturaUtils.normalizeArrayFromBackend(collections?.tipiCottura || []);
  }, [collections?.tipiCottura]);
  
  // Cotture dalla lavorazione
  const cotture = useMemo(() => lavorazione?.cotture || [], [lavorazione?.cotture]);
  
  // Gestione dell'aggiunta di una nuova cottura
  const handleAddCottura = useCallback(() => {
    setIsAddMode(true);
    setSelectedCottura(null);
  }, []);
  
  // Gestione della modifica di una cottura esistente
  const handleEditCottura = useCallback((cottura: Cottura) => {
    setSelectedCottura(cottura);
    setIsAddMode(true);
  }, []);
  
  // Gestione dell'annullamento del form
  const handleCancel = useCallback(() => {
    setIsAddMode(false);
    setSelectedCottura(null);
  }, []);
  
  // Gestione del salvataggio di una cottura
  const handleSaveCottura = useCallback(async (cottura: Cottura) => {
    if (!lavorazione) return;
    
    try {
      actions.setLoading('operations', true);
      
      let updatedCotture: Cottura[];
      
      if (cottura._id) {
        // Aggiornamento cottura esistente
        updatedCotture = cotture.map(c =>
          c._id === cottura._id ? cottura : c
        );
      } else {
        // Aggiunta nuova cottura con ID temporaneo
        const newCottura = {
          ...cottura,
          _id: `temp_${Date.now()}`
        };
        updatedCotture = [...cotture, newCottura];
      }
      
      await actions.handleSave({
        ...lavorazione,
        cotture: updatedCotture
      });
      
      setIsAddMode(false);
      setSelectedCottura(null);
    } catch (error) {
      console.error('Errore durante il salvataggio della cottura:', error);
    } finally {
      actions.setLoading('operations', false);
    }
  }, [lavorazione, cotture, actions]);
  
  // Gestione dell'eliminazione di una cottura
  const handleDeleteCottura = useCallback(async (cotturaId: string) => {
    if (!lavorazione) return;
    
    if (!window.confirm('Sei sicuro di voler eliminare questa cottura?')) {
      return;
    }
    
    try {
      actions.setLoading('operations', true);
      
      const updatedCotture = cotture.filter(c => c._id !== cotturaId);
      
      await actions.handleSave({
        ...lavorazione,
        cotture: updatedCotture
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione della cottura:', error);
    } finally {
      actions.setLoading('operations', false);
    }
  }, [lavorazione, cotture, actions]);

  // Utility per aggiornare le cotture senza salvataggio immediato
  const updateCottureLocally = useCallback((updatedCotture: Cottura[]) => {
    if (!lavorazione) return;
    
    actions.updateState({
      lavorazione: {
        ...lavorazione,
        cotture: updatedCotture
      },
      isDirty: true
    });
  }, [lavorazione, actions]);

  return {
    // Dati
    lavorazione,
    collections,
    saving,
    tipiCottura,
    cotture,
    
    // Stati
    isAddMode,
    selectedCottura,
    
    // Funzioni CRUD
    handleAddCottura,
    handleEditCottura,
    handleCancel,
    handleSaveCottura,
    handleDeleteCottura,
    updateCottureLocally
  };
};
