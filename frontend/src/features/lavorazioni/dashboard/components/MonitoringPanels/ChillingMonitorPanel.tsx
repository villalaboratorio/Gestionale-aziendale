import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonitoring } from '../../hooks/useMonitoring';
import {
  MonitorCard,
  MonitorHeader,
  ChillingList,
  ChillingItemCard,
  SchemaLabel,
  RecipeName,
  TemperatureDisplay,
  TemperatureValue,
  ProgressContainer,
  ProgressLabel,
  ProgressBar,
  ProgressFill,
  TimeRemaining,
  ViewButton,
  EmptyState,
  LoadingState,
  ErrorMessage
} from './ChillingMonitorPanel.styles';

export const ChillingMonitorPanel: React.FC = () => {
  const { activeChilling, loading, error, refresh } = useMonitoring();
  const navigate = useNavigate();
  
  const formatTimeRemaining = (seconds?: number): string => {
    if (!seconds) return 'N/D';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calcola la percentuale di progresso dell'abbattimento
  const calculateProgress = (item: typeof activeChilling[0]): number => {
    if (!item?.abbattimento?.inizio || !item?.abbattimento?.tempoResiduoStimato) {
      return 0;
    }
    
    const startTime = new Date(item.abbattimento.inizio).getTime();
    const estimatedDuration = item.abbattimento.tempoResiduoStimato * 1000; // converti in ms
    const elapsedTime = Date.now() - startTime;
    
    return Math.min(100, (elapsedTime / estimatedDuration) * 100);
  };
  
  if (loading) {
    return (
      <MonitorCard>
        <MonitorHeader>
          <i className="fas fa-snowflake"></i>
          <h4>Abbattimenti in Corso</h4>
        </MonitorHeader>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Caricamento dati abbattimenti...</p>
        </LoadingState>
      </MonitorCard>
    );
  }
  
  if (error) {
    return (
      <MonitorCard>
        <MonitorHeader>
          <i className="fas fa-snowflake"></i>
          <h4>Abbattimenti in Corso</h4>
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
        <i className="fas fa-snowflake"></i>
        <h4>Abbattimenti in Corso</h4>
      </MonitorHeader>
      
      {activeChilling && activeChilling.length > 0 ? (
        <ChillingList>
          {activeChilling.map(item => (
            <ChillingItemCard key={item.lavorazioneId}>
              <SchemaLabel>{item.numeroScheda || 'N/D'}</SchemaLabel>
              <RecipeName>{item.ricettaNome || 'Lavorazione'}</RecipeName>
              
              <TemperatureDisplay>
  <div>
    <small>Iniziale</small>
    <TemperatureValue>
      {item.abbattimento?.temperaturaIniziale ?? 'N/D'}°C
    </TemperatureValue>
  </div>
  <div>
    <small>Attuale</small>
    <TemperatureValue>
      {item.abbattimento?.temperaturaAttuale ?? '??'}°C
    </TemperatureValue>
  </div>
  <div>
    <small>Target</small>
    <TemperatureValue>
      {item.abbattimento?.temperaturaFinale ?? '??'}°C
    </TemperatureValue>
  </div>
</TemperatureDisplay>

              
              <ProgressContainer>
                <ProgressLabel>
                  <span>Progresso</span>
                  <span>{Math.round(calculateProgress(item))}%</span>
                </ProgressLabel>
                <ProgressBar>
                  <ProgressFill progress={calculateProgress(item)} />
                </ProgressBar>
              </ProgressContainer>
              
              <TimeRemaining>
                Tempo rimanente: {formatTimeRemaining(item.abbattimento?.tempoResiduoStimato)}
              </TimeRemaining>
              
              <ViewButton onClick={() => navigate(`/v2/lavorazione/${item.lavorazioneId}`)}>
                Visualizza
              </ViewButton>
            </ChillingItemCard>
          ))}
        </ChillingList>
      ) : (
        <EmptyState>
          <i className="fas fa-info-circle"></i>
          <p>Nessun abbattimento in corso</p>
        </EmptyState>
      )}
    </MonitorCard>
  );
};
