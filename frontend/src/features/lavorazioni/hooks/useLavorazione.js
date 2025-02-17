import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LavorazioneApi from '../services/LavorazioneApi';
  const useLavorazione = (id) => {
      const navigate = useNavigate();
      const [state, setState] = useState({
          lavorazione: {},
          collections: {
              clienti: [],
              ricette: [],
              tipiLavorazione: [],
              statiLavorazione: []
          },
          loading: true,
          error: null
      });

      const fetchData = useCallback(async () => {
          if (!id) return;
          setState(prev => ({ ...prev, loading: true }));
        
          try {
              const [lavorazioneRes, collectionsRes] = await Promise.all([
                  LavorazioneApi.getLavorazione(id),
                  LavorazioneApi.getCollections()
              ]);
            
              if (lavorazioneRes.success && lavorazioneRes.data) {
                  setState({
                      lavorazione: lavorazioneRes.data,
                      collections: collectionsRes.data,
                      loading: false,
                      error: null
                  });
              }
          } catch (error) {
              setState(prev => ({
                  ...prev,
                  loading: false,
                  error: error.message
              }));
          }
      }, [id]); // Solo id come dipendenza

      useEffect(() => {
          fetchData();
      }, [fetchData, id]); // Solo id come dipendenza, rimuoviamo fetchData

      const handleSave = useCallback(async (updates) => {
          setState(prev => ({ ...prev, loading: true }));
          try {
              const result = id
                  ? await LavorazioneApi.updateLavorazione(id, updates)
                  : await LavorazioneApi.createLavorazione(updates);

              setState(prev => ({
                  ...prev,
                  lavorazione: result.data,                  loading: false
              }));

            toast.success(id ? 'Lavorazione aggiornata' : 'Lavorazione creata');
            return result;
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
            toast.error(error.message);
            throw error;
        }
    }, [id]);

    const handleDelete = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            await LavorazioneApi.deleteLavorazione(id);
            navigate('/lavorazioni');
            toast.success('Lavorazione eliminata');
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
            toast.error(error.message);
            throw error;
        }
    }, [id, navigate]);

    return {
        ...state,
        isNew: !id,
        actions: {
            fetchData,
            handleSave,
            handleDelete
        }
    };
};

export default useLavorazione;