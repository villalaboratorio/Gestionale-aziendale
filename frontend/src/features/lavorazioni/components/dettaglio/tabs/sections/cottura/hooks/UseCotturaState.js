import { useState, useCallback, useEffect } from 'react';
import useCottura from '../../../../../../hooks/useCottura';
import LavorazioneApi from '../../../../../../services/LavorazioneApi';

const useCotturaState = (lavorazioneId) => {
  const [tipiCottura, setTipiCottura] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  
  const {
    cotture,
    loading,
    error,
    updateCottura,
    startCottura: apiStartCottura,
    completaCottura: apiCompletaCottura,
    removeCottura
  } = useCottura(lavorazioneId);

  const getTipiCottura = useCallback(async () => {
    try {
      const response = await LavorazioneApi.getTipiCottura();
      if (response.success) {
        setTipiCottura(response.data);
      }
    } catch (error) {
      console.error('Errore nel recupero tipi cottura:', error);
    }
  }, []);

  const getDefaultValues = useCallback((ricetta) => ({
    tipoCottura: ricetta?.cotture?.[0]?.tipoCottura || '',
    temperaturaTarget: ricetta?.cotture?.[0]?.temperatura || 0,
    tempoCottura: ricetta?.cotture?.[0]?.tempoCottura || 0,
    addetto: ''
  }), []);

  const handleStartCottura = useCallback(async (cotturaId) => {
    try {
      const cottura = cotture.find(c => c._id === cotturaId);
      if (!cottura) throw new Error('Cottura non trovata');

      const now = new Date();
      const finePrevista = new Date(now.getTime() + (cottura.tempoCottura * 60000));

      await apiStartCottura(cotturaId, {
        inizio: now,
        finePrevista,
        stato: 'in_corso'
      });

      return true;
    } catch (error) {
      console.error('Errore avvio cottura:', error);
      return false;
    }
  }, [cotture, apiStartCottura]);

  const handleCompletaCottura = useCallback(async (cotturaId) => {
    try {
      const cottura = cotture.find(c => c._id === cotturaId);
      if (!cottura) throw new Error('Cottura non trovata');

      await apiCompletaCottura(cotturaId, {
        fine: new Date(),
        stato: 'completata',
        temperaturaFinale: cottura.temperaturaTarget
      });

      return true;
    } catch (error) {
      console.error('Errore completamento cottura:', error);
      return false;
    }
  }, [cotture, apiCompletaCottura]);

  const handleEdit = useCallback((cotturaId) => {
    const cottura = cotture.find(c => c._id === cotturaId);
    if (!cottura) return;

    setEditValues({
      temperaturaTarget: cottura.temperaturaTarget,
      tempoCottura: cottura.tempoCottura,
      tipoCottura: cottura.tipoCottura,
      addetto: cottura.addetto
    });
    setEditingId(cotturaId);
  }, [cotture]);

  const handleSave = useCallback(async (cotturaId) => {
    try {
      const updates = Object.entries(editValues).map(([field, value]) => 
        updateCottura(cotturaId, field, value)
      );
      
      await Promise.all(updates);
      setEditingId(null);
      setEditValues({});
      return true;
    } catch (error) {
      console.error('Errore salvataggio modifiche:', error);
      return false;
    }
  }, [editValues, updateCottura]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditValues({});
  }, []);

  useEffect(() => {
    getTipiCottura();
  }, [getTipiCottura]);

  return {
    cotture,
    loading,
    error,
    editingId,
    editValues,
    tipiCottura,
    getDefaultValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleStartCottura,
    handleCompletaCottura,
    removeCottura
  };
};

export default useCotturaState;
