import { useState, useEffect, useCallback } from 'react';
import { monitoringService, MonitoringData } from '../services/monitoringService';

// Intervallo di polling in millisecondi (30 secondi)
const POLLING_INTERVAL = 30000;

export const useMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    activeCooking: [],
    activeChilling: [],
    activeAssembly: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Funzione per caricare i dati
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await monitoringService.getActiveProcesses();
      setMonitoringData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      console.error('Errore nel recupero dei dati di monitoraggio:', err);
      setError(`Impossibile caricare i dati di monitoraggio: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Effetto per il polling dei dati
  useEffect(() => {
    // Carica subito i dati
    fetchData();
    
    // Imposta il polling per aggiornamenti periodici
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);
    
    // Pulisci l'intervallo quando il componente viene smontato
    return () => clearInterval(intervalId);
  }, [fetchData]);
  
  // Funzione per forzare un aggiornamento manuale
  const refresh = () => {
    fetchData();
  };
  
  return {
    activeCooking: monitoringData.activeCooking,
    activeChilling: monitoringData.activeChilling,
    activeAssembly: monitoringData.activeAssembly,
    loading,
    error,
    refresh
  };
};
