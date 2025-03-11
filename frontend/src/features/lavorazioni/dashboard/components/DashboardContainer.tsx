import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsGrid } from './StatsGrid/StatsGrid';
import { Filters } from './Filters/Filters';
import { LavorazioniTable } from './LavorazioniTable/LavorazioneTable';
import { CookingMonitorPanel } from './MonitoringPanels/CookingMonitorPanel';
import { ChillingMonitorPanel } from './MonitoringPanels/ChillingMonitorPanel';
import { AssemblyMonitorPanel } from './MonitoringPanels/AssemblyMonitorPanel';
import { useDashboardState } from '../hooks/useDashboardState';
import { useDashboardActions } from '../hooks/useDashboardActions';
import { ApiResponse } from '@core/types';
import { Lavorazione } from '../../types/models.types';
import { Nav } from 'react-bootstrap';
import {
  DashboardWrapper,
  DashboardHeader,
  HeaderContent,
  Title,
  Subtitle,
  Button,
  Card,
  CardHeader,
  CardBody,
  MonitoringTabs,
  MonitoringContent,
  FilterBadge,
  FilterBadgesContainer
} from './DashboardContainer.styles';

interface DashboardFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface DashboardStats {
  total: number;
  inProgress: number;
  completed: number;
  pending: number;
}

interface DashboardPagination {
  total: number;
  pages: number;
  currentPage: number;
  pageSize: number;
}

interface DashboardResponse {
  items: Lavorazione[];
  stats: DashboardStats;
  pagination: DashboardPagination;
}

export const DashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  
  const { 
    items, 
    setItems, 
    loading, 
    setLoading,
    filters,
    setFilters,
    initialLoadDone,
    setInitialLoadDone,
    areFiltersEqual
  } = useDashboardState();
  
  const { loadData } = useDashboardActions();
  
  // Stato per gestire il tab attivo
  const [activeTab, setActiveTab] = React.useState<string>('cooking');
  
  // Ref per memorizzare l'ultimo valore di filters per confronti
  const lastFiltersRef = React.useRef<DashboardFilters>({});
  
  // Funzione per il fetching dei dati - semplificata
  const fetchData = React.useCallback(async () => {
    // Previene chiamate duplicate durante il caricamento
    if (loading) {
      console.log('Già in caricamento, ignoro la richiesta');
      return;
    }
    
    setLoading(true);
    console.log('fetchData: inizio caricamento dati');
    
    try {
      console.log('Fetching data with filters:', filters);
      
      // Costruisci i parametri di query per il backend
      const queryParams: Record<string, string> = {};
      
      if (filters.status) queryParams.status = filters.status;
      if (filters.dateFrom) queryParams.dateFrom = filters.dateFrom;
      if (filters.dateTo) queryParams.dateTo = filters.dateTo;
      if (filters.search) queryParams.search = filters.search;
      
      // Debug info
      console.log('API parameters:', queryParams);
      
      // Passa i parametri di query alla chiamata API
      const response = await loadData(Object.keys(queryParams).length > 0 ? queryParams : undefined) as ApiResponse<DashboardResponse>;
      
      if (response?.success && Array.isArray(response.data?.items)) {
        setItems(response.data.items);
        console.log('Data loaded successfully:', response.data.items.length, 'items');
      } else {
        console.error('Response not successful or does not contain items array', response);
      }
      
      // Memorizza i filtri correnti per confronti futuri
      lastFiltersRef.current = { ...filters };
      
      // Segna il caricamento iniziale come completato
      if (!initialLoadDone) {
        setInitialLoadDone();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      console.log('fetchData: fine caricamento dati');
    }
  }, [loadData, setItems, loading, setLoading, filters, initialLoadDone, setInitialLoadDone]);
  
  // useEffect per il caricamento iniziale - eseguito solo al mount
  React.useEffect(() => {
    console.log('Initial load effect triggered');
    fetchData();
  }, []); // Array di dipendenze vuoto per eseguire solo al mount
  
  // useEffect separato per gestire i cambiamenti nei filtri
  React.useEffect(() => {
    // Skip se è il primo caricamento o se è in corso un caricamento
    if (!initialLoadDone || loading) {
      console.log('Skipping filter effect - initial load not done or loading in progress');
      return;
    }
    
    // Confronta con i filtri precedenti per evitare chiamate inutili
    if (areFiltersEqual(filters, lastFiltersRef.current)) {
      console.log('Filters unchanged, skipping fetch');
      return;
    }
    
    console.log('Filters changed, will fetch new data:', filters);
    
    // Usa un timeout per debounce
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters]); // Solo filters come dipendenza
  
  // Gestione filtri
  const handleFilter = React.useCallback((newFilters: DashboardFilters) => {
    console.log('handleFilter called with:', newFilters);
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      console.log('Updated filters:', updated);
      return updated;
    });
  }, [setFilters]);
  
  // Handler per la selezione dello stato dai badge
  const handleStatusFilterFromBadge = React.useCallback((status: string | null) => {
    console.log('Status filter from badge:', status);
    if (status === null) {
      // Se si clicca su "Totali", rimuovi il filtro dello stato
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.status;
        return newFilters;
      });
    } else {
      // Altrimenti, imposta il filtro dello stato
      setFilters(prev => ({
        ...prev,
        status
      }));
    }
  }, [setFilters]);
  
  // Refresh manuale
  const handleRefresh = React.useCallback(() => {
    console.log('Manual refresh requested');
    fetchData();
  }, [fetchData]);
  
  // Navigazione alla pagina di creazione nuova lavorazione
  const handleNewLavorazione = React.useCallback(() => {
    navigate('/v2/lavorazione/new');
  }, [navigate]);
  
  // Gestione cambio tab
  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
    }
  };
  
  // Rimuovi un filtro specifico
  const removeFilter = React.useCallback((filterKey: keyof DashboardFilters) => {
    console.log('Removing filter:', filterKey);
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, [setFilters]);
  
  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderContent>
          <Title>Dashboard Lavorazioni</Title>
          <Subtitle>Gestione e monitoraggio delle lavorazioni in corso</Subtitle>
        </HeaderContent>
        <Button onClick={handleNewLavorazione} type="button">
          <i className="fas fa-plus"></i>
          Nuova Lavorazione
        </Button>
      </DashboardHeader>
      
      <StatsGrid 
        items={items} 
        onFilterByStatus={handleStatusFilterFromBadge}
      />
      
      <Card>
        <CardHeader>
          <h3>Filtri e Ricerca</h3>
        </CardHeader>
        <CardBody>
          {/* Visualizza badge per i filtri attivi */}
          {(filters.status || filters.dateFrom || filters.dateTo || filters.search) && (
            <FilterBadgesContainer>
              {filters.status && (
                <FilterBadge onClick={() => removeFilter('status')}>
                  Stato: {filters.status} <i className="fas fa-times"></i>
                </FilterBadge>
              )}
              {filters.dateFrom && (
                <FilterBadge onClick={() => removeFilter('dateFrom')}>
                  Da: {new Date(filters.dateFrom).toLocaleDateString()} <i className="fas fa-times"></i>
                </FilterBadge>
              )}
              {filters.dateTo && (
                <FilterBadge onClick={() => removeFilter('dateTo')}>
                  A: {new Date(filters.dateTo).toLocaleDateString()} <i className="fas fa-times"></i>
                </FilterBadge>
              )}
              {filters.search && (
                <FilterBadge onClick={() => removeFilter('search')}>
                  Ricerca: {filters.search} <i className="fas fa-times"></i>
                </FilterBadge>
              )}
              {(Object.keys(filters).length > 0) && (
                <FilterBadge onClick={() => setFilters({})} $variant="clear">
                  Cancella tutti <i className="fas fa-trash-alt"></i>
                </FilterBadge>
              )}
            </FilterBadgesContainer>
          )}
          
          <Filters 
            onFilter={handleFilter}
            currentFilters={filters}
          />
        </CardBody>
      </Card>
      
      <div className="table-container">
        <LavorazioniTable 
          items={items}
          loading={loading}
          onRefresh={handleRefresh}
        />
      </div>
      
      <Card>
        <CardHeader>
          <h3>Monitoraggio Processi</h3>
        </CardHeader>
        <CardBody>
          <MonitoringTabs 
            activeKey={activeTab} 
            onSelect={handleTabSelect}
          >
            <Nav.Item>
              <Nav.Link 
                eventKey="cooking" 
                className={`${activeTab === 'cooking' ? 'cooking active' : ''}`}
              >
                <i className="fas fa-fire"></i>
                Cotture in Corso
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="chilling" 
                className={`${activeTab === 'chilling' ? 'chilling active' : ''}`}
              >
                <i className="fas fa-snowflake"></i>
                Abbattimenti in Corso
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="assembly" 
                className={`${activeTab === 'assembly' ? 'assembly active' : ''}`}
              >
                <i className="fas fa-puzzle-piece"></i>
                Assemblaggi in Corso
              </Nav.Link>
            </Nav.Item>
          </MonitoringTabs>
          
          <MonitoringContent>
            {activeTab === 'cooking' && <CookingMonitorPanel />}
            {activeTab === 'chilling' && <ChillingMonitorPanel />}
            {activeTab === 'assembly' && <AssemblyMonitorPanel />}
          </MonitoringContent>
        </CardBody>
      </Card>
    </DashboardWrapper>
  );
};
