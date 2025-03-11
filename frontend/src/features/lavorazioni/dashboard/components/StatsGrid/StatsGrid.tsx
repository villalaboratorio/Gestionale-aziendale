import * as React from 'react';
import { Lavorazione } from '../../../types/models.types';
import {
  StatsContainer,
  StatCard,
  StatContent,
  StatTitle,
  StatValue,
  StatIcon
} from './StatsGrid.styles';

interface StatsGridProps {
  items: Lavorazione[];
  onFilterByStatus?: (status: string | null) => void; // Nuova prop per la callback
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  items = [], 
  onFilterByStatus 
}) => {
  // Funzione migliorata che usa una ricerca più flessibile
  const getFilteredCount = (statusPattern: string): number => {
    return items.filter(item => {
      if (!item.statoLavorazione || typeof item.statoLavorazione !== 'object') {
        return false;
      }
      
      const nameMatch = item.statoLavorazione.name && 
                      item.statoLavorazione.name.toUpperCase().includes(statusPattern);
      const descMatch = item.statoLavorazione.description && 
                      item.statoLavorazione.description.toUpperCase().includes(statusPattern);
      
      return nameMatch || descMatch;
    }).length;
  };

  const stats = {
    total: items.length,
    inProgress: getFilteredCount('LAVORAZIONE'),
    completed: getFilteredCount('COMPLET'),
    pending: getFilteredCount('ATTES')
  };

  // Handler per i click sulle card
  const handleCardClick = (statusFilter: string | null) => {
    if (onFilterByStatus) {
      onFilterByStatus(statusFilter);
    }
  };

  return (
    <StatsContainer>
      <StatCard 
        onClick={() => handleCardClick(null)} // Nessun filtro (mostra tutti)
        $clickable={!!onFilterByStatus} // Styling condizionale per mostrare se è cliccabile
      >
        <StatContent>
          <StatTitle>Totali</StatTitle>
          <StatValue>{stats.total}</StatValue>
        </StatContent>
        <StatIcon>
          <i className="fas fa-clipboard-list"></i>
        </StatIcon>
      </StatCard>
      
      <StatCard 
        variant="primary"
        onClick={() => handleCardClick('IN LAVORAZIONE')}
        $clickable={!!onFilterByStatus}
      >
        <StatContent>
          <StatTitle>In Lavorazione</StatTitle>
          <StatValue>{stats.inProgress}</StatValue>
        </StatContent>
        <StatIcon>
          <i className="fas fa-cogs"></i>
        </StatIcon>
      </StatCard>
      
      <StatCard 
        variant="success"
        onClick={() => handleCardClick('COMPLETATA')}
        $clickable={!!onFilterByStatus}
      >
        <StatContent>
          <StatTitle>Completate</StatTitle>
          <StatValue>{stats.completed}</StatValue>
        </StatContent>
        <StatIcon>
          <i className="fas fa-check-circle"></i>
        </StatIcon>
      </StatCard>
      
      <StatCard 
        variant="warning"
        onClick={() => handleCardClick('IN ATTESA')}
        $clickable={!!onFilterByStatus}
      >
        <StatContent>
          <StatTitle>In Attesa</StatTitle>
          <StatValue>{stats.pending}</StatValue>
        </StatContent>
        <StatIcon>
          <i className="fas fa-clock"></i>
        </StatIcon>
      </StatCard>
    </StatsContainer>
  );
};
