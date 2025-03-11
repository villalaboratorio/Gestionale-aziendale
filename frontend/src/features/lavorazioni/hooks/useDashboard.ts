import { useState, useCallback, useEffect } from 'react';
import { lavorazioneService } from '../services/lavorazione.service';
import { Lavorazione } from '../types/models.types';
import { ApiResponse } from '../../../core/types';

// Interfaccia per i filtri di dashboard
interface DashboardFilters {
  stato?: string;
  dataInizio?: string;
  dataFine?: string;
  search?: string;
}

export const useDashboard = () => {
  const [items, setItems] = useState<Lavorazione[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});
  
  // Funzione per caricare i dati dalla API
  const loadData = useCallback(async (currentFilters: DashboardFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Utilizziamo il metodo dal service aggiornato
      const response: ApiResponse<Lavorazione[]> = await lavorazioneService.getDashboardLavorazioni(
        currentFilters
      );
      
      if (response.success && Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        console.error('Risposta API non valida:', response);
        setError(response.message || 'Errore nel caricamento dei dati');
        setItems([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      console.error('Error loading lavorazioni:', error);
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Caricamento iniziale dei dati al mount del componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Funzione per aggiornare i filtri e ricaricare i dati
  const updateFilters = useCallback((newFilters: DashboardFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadData(updatedFilters);
  }, [filters, loadData]);

  // Funzione per reset dei filtri
  const resetFilters = useCallback(() => {
    setFilters({});
    loadData({});
  }, [loadData]);

  return {
    items,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refresh: () => loadData(filters) // Funzione di refresh che mantiene i filtri correnti
  };
};
