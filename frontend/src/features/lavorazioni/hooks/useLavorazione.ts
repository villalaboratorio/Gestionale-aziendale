import { useState, useCallback, useEffect } from 'react';
import { lavorazioneService } from '../services';
import { Lavorazione,  } from '../types';
import { eventBus } from '@core/events';
import { EventType } from '@core/types';

interface LavorazioneState {
  lavorazione: Lavorazione | null;
  loading: boolean;
  error: string | null;
}

export const useLavorazione = (id: string) => {
  const [state, setState] = useState<LavorazioneState>({
    lavorazione: null,
    loading: true,
    error: null
  });

  const fetchLavorazione = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await lavorazioneService.getLavorazione(id);
      if (response.success) {
        setState({
          lavorazione: response.data,
          loading: false,
          error: null
        });
        eventBus.emit('lavorazione:loaded', { id }, EventType.INFO);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Errore nel caricamento della lavorazione'
      }));
      eventBus.emit('lavorazione:error', { id, error }, EventType.ERROR);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLavorazione();
    }
  }, [id, fetchLavorazione]);

  const handleSave = useCallback(async (data: Partial<Lavorazione>) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = id 
        ? await lavorazioneService.updateLavorazione(id, data)
        : await lavorazioneService.createLavorazione(data);

      if (response.success) {
        setState(prev => ({
          ...prev,
          lavorazione: response.data,
          loading: false
        }));
        eventBus.emit('lavorazione:saved', { id: response.data._id }, EventType.INFO);
        return response;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Errore nel salvataggio'
      }));
      eventBus.emit('lavorazione:error', { id, error }, EventType.ERROR);
      throw error;
    }
  }, [id]);

  return {
    ...state,
    fetchLavorazione,
    handleSave
  };
};
