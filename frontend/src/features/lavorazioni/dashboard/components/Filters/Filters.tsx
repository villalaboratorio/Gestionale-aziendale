import * as React from 'react';
import {
  FiltersContainer,
  FiltersBody,
  FiltersHeader,  // Importato correttamente
  FiltersTitle,   // Importato correttamente
  SearchContainer,
  SearchInput,
  FilterControls,
  FilterGroup,
  FormControl,
  ActionButtons,
  ButtonSecondary,
  ButtonPrimary,
  CollapseButton // Nuovo componente per il toggle
} from './Filters.styles';

interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  // status è stato rimosso da qui
}

export interface FiltersProps {
  onFilter: (filters: DashboardFilters) => void;
  currentFilters: DashboardFilters;
}

export const Filters: React.FC<FiltersProps> = ({ onFilter, currentFilters }) => {
  const [filters, setFilters] = React.useState<DashboardFilters>(currentFilters);
  // Stato per gestire l'espansione/collasso del pannello
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleChange = (key: keyof DashboardFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    const emptyFilters = { dateFrom: '', dateTo: '', search: '' };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  // Toggle per espandere/collassare il pannello
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <FiltersContainer>
      <FiltersHeader onClick={toggleExpanded}>
        <FiltersTitle>Filtri Avanzati</FiltersTitle>
        <CollapseButton onClick={(e) => {
          e.stopPropagation(); // Previene doppio trigger dal click del parent
          toggleExpanded();
        }}>
          {isExpanded ? (
            <i className="fas fa-chevron-up"></i>
          ) : (
            <i className="fas fa-chevron-down"></i>
          )}
        </CollapseButton>
      </FiltersHeader>
      
      {/* Contenuto dei filtri che può essere collassato */}
      {isExpanded && (
        <FiltersBody>
          <form onSubmit={handleSubmit}>
            <SearchContainer>
              <SearchInput>
                <FormControl
                  type="text"
                  placeholder="Cerca per cliente, ricetta o codice..."
                  value={filters.search || ''}
                  onChange={(e) => handleChange('search', e.target.value)}
                />
              </SearchInput>
            </SearchContainer>
            
            <FilterControls>
              {/* Il filtro per stato è stato rimosso */}
              <FilterGroup>
                <FormControl 
                  type="date" 
                  placeholder="Data inizio"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleChange('dateFrom', e.target.value)}
                />
              </FilterGroup>
              
              <FilterGroup>
                <FormControl 
                  type="date" 
                  placeholder="Data fine"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleChange('dateTo', e.target.value)}
                />
              </FilterGroup>
            </FilterControls>
            
            <ActionButtons>
              <ButtonSecondary type="button" onClick={handleReset}>
                Reimposta
              </ButtonSecondary>
              <ButtonPrimary type="submit">
                Applica filtri
              </ButtonPrimary>
            </ActionButtons>
          </form>
        </FiltersBody>
      )}
    </FiltersContainer>
  );
};
