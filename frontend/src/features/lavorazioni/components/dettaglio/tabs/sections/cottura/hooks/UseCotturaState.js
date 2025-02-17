import { useState, useCallback, useEffect } from 'react';
import useCottura from '../../../../../../hooks/useCottura';
import LavorazioneApi from '../../../../../../services/LavorazioneApi';
import { useLavorazioneContext } from '../../../../../../context/LavorazioneContext';

const useCotturaState = (lavorazioneId) => {
  const { data: { lavorazione } } = useLavorazioneContext();
  const [cotture, setCotture] = useState([]);
  const [tipiCottura, setTipiCottura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const {
    updateCottura,
    startCottura: apiStartCottura,
    completaCottura: apiCompletaCottura,
    removeCottura: apiRemoveCottura
  } = useCottura(lavorazioneId);

  const fetchCotture = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📥 Recupero cotture per lavorazione:', lavorazioneId);
      
      const response = await LavorazioneApi.getCotture(lavorazioneId);
      console.log('Risposta API cotture:', response);
      
      if (response.success) {
        const cottureConParametri = response.data.map(cottura => ({
          ...cottura,
          parametriRicetta: lavorazione?.ricetta?.cotture?.find(c => 
            c.tipoCottura === cottura.tipoCottura
          )
        }));
        
        console.log('Cotture processate:', cottureConParametri);
        setCotture(cottureConParametri);
      }
    } catch (error) {
      console.error('Errore recupero cotture:', error);
    } finally {
      setLoading(false);
    }
  }, [lavorazioneId, lavorazione]);

  const getTipiCottura = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LavorazioneApi.getTipiCottura();
      
      if (response.success && Array.isArray(response.data)) {
        setTipiCottura(response.data);
        setErrors(null);
      } else {
        throw new Error('Dati tipi cottura non validi');
      }
    } catch (error) {
      console.error('Errore caricamento tipi cottura:', error);
      setErrors('Errore nel recupero tipi cottura');
      setTipiCottura([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateCottura = useCallback(async (updates) => {
    try {
      setLoading(true);
      console.log('Dati ricevuti per update:', updates);

      // Per nuove cotture
      if (!updates._id) {
        const response = await LavorazioneApi.addCottura(lavorazioneId, {
          ...updates,
          stato: 'non_iniziata'
        });
        if (response.success) {
          await fetchCotture();
          return true;
        }
      } 
      // Per aggiornamenti
      else {
        await updateCottura(updates._id, updates);
        await fetchCotture();
        return true;
      }

    } catch (error) {
      console.error('Errore aggiornamento cottura:', error);
      setErrors('Errore nell\'aggiornamento della cottura');
      return false;
    } finally {
      setLoading(false);
    }
  }, [lavorazioneId, updateCottura, fetchCotture]);
  const handleStartCottura = useCallback(async (cotturaId) => {
    try {
      setLoading(true);
      
      const cottura = cotture.find(c => c._id === cotturaId);
      if (!cottura) throw new Error('Cottura non trovata');

      const now = new Date();
      const finePrevista = new Date(now.getTime() + (cottura.tempoCottura * 60000));

      await apiStartCottura(cotturaId, {
        inizio: now,
        finePrevista,
        stato: 'in_corso'
      });

      await fetchCotture();
      return true;
    } catch (error) {
      console.error('Errore avvio cottura:', error);
      setErrors('Errore nell\'avvio della cottura');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cotture, apiStartCottura, fetchCotture]);

  const handleCompletaCottura = useCallback(async (cotturaId) => {
    try {
      setLoading(true);
      
      const cottura = cotture.find(c => c._id === cotturaId);
      if (!cottura) throw new Error('Cottura non trovata');

      await apiCompletaCottura(cotturaId, {
        fine: new Date(),
        stato: 'completata',
        temperaturaFinale: cottura.temperaturaTarget
      });

      await fetchCotture();
      return true;
    } catch (error) {
      console.error('Errore completamento cottura:', error);
      setErrors('Errore nel completamento della cottura');
      return false;
    } finally {
      setLoading(false);
    }
  }, [cotture, apiCompletaCottura, fetchCotture]);

  const handleRemoveCottura = useCallback(async (cotturaId) => {
    try {
      setLoading(true);
      await apiRemoveCottura(cotturaId);
      await fetchCotture();
      return true;
    } catch (error) {
      console.error('Errore rimozione cottura:', error);
      setErrors('Errore nella rimozione della cottura');
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiRemoveCottura, fetchCotture]);

  useEffect(() => {
    fetchCotture();
    getTipiCottura();
  }, [fetchCotture, getTipiCottura]);

  const handleEdit = useCallback((cotturaId) => {
    setIsEditing(true);
    setEditingId(cotturaId);
  }, []);

  const handleSave = useCallback(async (cotturaId, updates) => {
    try {
      await handleUpdateCottura(cotturaId, updates);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error('Errore salvataggio:', error);
    }
  }, [handleUpdateCottura]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingId(null);
  }, []);

  return {
    cotture,
    tipiCottura,
    loading,
    errors,
    isEditing,
    editingId,
    handleEdit,
    handleSave,
    handleCancel,
    handleUpdateCottura,
    handleStartCottura,
    handleCompletaCottura,
    removeCottura: handleRemoveCottura
  };
};

export default useCotturaState;
