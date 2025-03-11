import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MonitorCard,
  MonitorHeader,
  AssemblyList,
  AssemblyItemCard,
  SchemaLabel,
  RecipeName,
  AssemblyType,
  DetailRow,
  DetailLabel,
  DetailValue,
  ViewButton,
  EmptyState,
  LoadingState,
  ErrorMessage
} from './AssemblyMonitorPanel.styles';

import { useMonitoring } from '../../hooks/useMonitoring';

export const AssemblyMonitorPanel: React.FC = () => {
  const { activeAssembly, loading, error, refresh } = useMonitoring();
  const navigate = useNavigate();
  
  // Formatta il tipo di assemblaggio in modo leggibile
  const formatAssemblyType = React.useCallback((tipo: string): string => {
    switch (tipo) {
      case 'crudo':
        return 'Assemblaggio a Crudo';
      case 'dopoCottura':
        return 'Assemblaggio Post-Cottura';
      case 'dopoCotturaParziale':
        return 'Assemblaggio Post-Cottura Parziale';
      case 'crudoSegueCottura':
        return 'Assemblaggio Crudo + Cottura';
      default:
        return 'Assemblaggio';
    }
  }, []);
  
  // Calcola il tempo trascorso dall'inizio dell'assemblaggio
  const getElapsedTime = React.useCallback((startDate?: Date | string): string => {
    if (!startDate) return 'N/D';
    
    try {
      const start = new Date(startDate).getTime();
      if (isNaN(start)) return 'N/D';
      
      const now = Date.now();
      const elapsedMs = now - start;
      
      const minutes = Math.floor(elapsedMs / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      }
      
      return `${minutes}m`;
    } catch (e) {
      console.error('Errore nel calcolo del tempo trascorso:', e);
      return 'N/D';
    }
  }, []);

  // Gestione stato di caricamento
  if (loading) {
    return (
      <MonitorCard>
        <MonitorHeader>
          <i className="fas fa-layer-group"></i>
          <h4>Assemblaggi in Corso</h4>
        </MonitorHeader>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Caricamento dati assemblaggi...</p>
        </LoadingState>
      </MonitorCard>
    );
  }
  
  // Gestione stato di errore
  if (error) {
    return (
      <MonitorCard>
        <MonitorHeader>
          <i className="fas fa-layer-group"></i>
          <h4>Assemblaggi in Corso</h4>
        </MonitorHeader>
        <ErrorMessage>
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-sm btn-outline-secondary" onClick={refresh}>
            Riprova
          </button>
        </ErrorMessage>
      </MonitorCard>
    );
  }
  
  return (
    <MonitorCard>
      <MonitorHeader>
        <i className="fas fa-layer-group"></i>
        <h4>Assemblaggi in Corso</h4>
        {activeAssembly && activeAssembly.length > 0 && (
          <span className="badge bg-primary ms-2">{activeAssembly.length}</span>
        )}
      </MonitorHeader>
      
      {activeAssembly && activeAssembly.length > 0 ? (
        <AssemblyList>
          {activeAssembly.map(item => (
            <AssemblyItemCard key={item.lavorazioneId}>
              <SchemaLabel>{item.numeroScheda}</SchemaLabel>
              <RecipeName>{item.ricettaNome || 'Lavorazione'}</RecipeName>
              
              <AssemblyType>
                {formatAssemblyType(item.assemblaggio.tipo)}
              </AssemblyType>
              
              <DetailRow>
                <DetailLabel>Addetto</DetailLabel>
                <DetailValue>{item.assemblaggio.addetto || 'Non assegnato'}</DetailValue>
              </DetailRow>
              
              <DetailRow>
                <DetailLabel>Stato</DetailLabel>
                <DetailValue>{item.assemblaggio.stato === 'in_corso' ? 'In Corso' : 'Da Completare'}</DetailValue>
              </DetailRow>
              
              {item.assemblaggio.dataInizio && (
                <DetailRow>
                  <DetailLabel>Tempo trascorso</DetailLabel>
                  <DetailValue>{getElapsedTime(item.assemblaggio.dataInizio)}</DetailValue>
                </DetailRow>
              )}
              
              <ViewButton onClick={() => navigate(`/v2/lavorazione/${item.lavorazioneId}`)}>
                Visualizza
              </ViewButton>
            </AssemblyItemCard>
          ))}
        </AssemblyList>
      ) : (
        <EmptyState>
          <i className="fas fa-info-circle"></i>
          <p>Nessun assemblaggio in corso</p>
        </EmptyState>
      )}
    </MonitorCard>
  );
};
