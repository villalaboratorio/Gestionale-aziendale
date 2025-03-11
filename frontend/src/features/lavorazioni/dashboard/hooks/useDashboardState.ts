import * as React from 'react';
import { Lavorazione } from '../../types/models.types';

interface DashboardFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface DashboardState {
  items: Lavorazione[];
  loading: boolean;
  filters: DashboardFilters;
  // Aggiungiamo una proprietà per tracciare il caricamento iniziale
  initialLoadDone: boolean;
}

export const useDashboardState = () => {
  const [state, setState] = React.useState<DashboardState>({
    items: [],
    loading: false,
    filters: {},
    initialLoadDone: false
  });

  const setItems = React.useCallback((items: Lavorazione[]) => {
    setState(prev => ({ ...prev, items }));
  }, []);

  const setLoading = React.useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setFilters = React.useCallback((filtersOrUpdater: DashboardFilters | ((prev: DashboardFilters) => DashboardFilters)) => {
    setState(prev => ({ 
      ...prev, 
      filters: typeof filtersOrUpdater === 'function' 
        ? filtersOrUpdater(prev.filters) 
        : filtersOrUpdater 
    }));
  }, []);

  // Funzione per impostare initialLoadDone
  const setInitialLoadDone = React.useCallback(() => {
    setState(prev => ({ ...prev, initialLoadDone: true }));
  }, []);

  // Funzione per confrontare filtri
  const areFiltersEqual = React.useCallback((a: DashboardFilters, b: DashboardFilters): boolean => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => a[key as keyof DashboardFilters] === b[key as keyof DashboardFilters]);
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    filters: state.filters,
    initialLoadDone: state.initialLoadDone,
    setItems,
    setLoading,
    setFilters,
    setInitialLoadDone,
    areFiltersEqual
  };
};
