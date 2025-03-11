import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/endpoints/dashboardApi';
import { 
  StatsPanelContainer, 
  StatsGrid, 
  StatCard,
  LoadingState 
} from './StatsPanel.styles';

interface StatData {
  title: string;
  value: number | string;
  icon: string;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
}

export const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponses, setApiResponses] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Chiamata all'API delle statistiche
        const response = await dashboardApi.getStatistics();
        console.log("Risposta API statistiche:", response);
        
        // Salva la risposta per debugging
        setApiResponses(prev => ({ ...prev, statistics: response }));
        
        if (!response.success) {
          throw new Error('Errore nel caricamento delle statistiche');
        }
        
        // Controllo se i dati hanno la struttura attesa
        if (!response.data || !response.data.totals) {
          console.warn("Struttura dati API non valida:", response.data);
          throw new Error('Formato dati non valido');
        }
        
        // Ottieni dati specifici per materie prime - CORREZIONE
        let materiePrimeCritiche = 0;
        try {
          // Usa il servizio API centralizzato invece di fetch diretto
          const materiePrimeResponse = await dashboardApi.getMateriePrimeStats();
          console.log("Risposta API materie prime:", materiePrimeResponse);
          
          // Salva la risposta per debugging
          setApiResponses(prev => ({ ...prev, materiePrime: materiePrimeResponse }));
          
          if (materiePrimeResponse.success && materiePrimeResponse.data) {
            materiePrimeCritiche = materiePrimeResponse.data.critiche || 0;
          }
        } catch (materiePrimeError) {
          console.error("Errore nel recupero statistiche materie prime:", materiePrimeError);
          // Continua con 0 come valore di default
        }
        
        // Resto del codice...
        
        // Trasformiamo i dati ricevuti nel formato che ci serve
        const statsData: StatData[] = [
          {
            title: 'Lavorazioni in Corso',
            value: response.data.totals.inCorso || 0,
            icon: 'fa-tasks',
            variant: 'primary',
            description: 'Attività in produzione'
          },
          {
            title: 'Lavorazioni Completate',
            value: response.data.totals.completate || 0,
            icon: 'fa-check-circle',
            variant: 'success',
            description: (response.data.trends && response.data.trends.length > 0) 
              ? (response.data.trends[0].valore > 0 ? 'In aumento rispetto a ieri' : 'In calo rispetto a ieri') 
              : 'Dato non disponibile',
            trend: (response.data.trends && response.data.trends.length > 0) 
              ? (response.data.trends[0].valore > 0 ? 'up' : 'down') 
              : 'neutral',
            percentage: (response.data.trends && response.data.trends.length > 0) 
              ? Math.abs(response.data.trends[0].valore || 0)
              : undefined
          },
          {
            title: 'Lavorazioni in Attesa',
            value: response.data.totals.inAttesa || 0,
            icon: 'fa-clock',
            variant: response.data.totals.inAttesa > 5 ? 'warning' : 'info',
            description: 'Da pianificare'
          },
          {
            title: 'Materie Prime Critiche',
            value: materiePrimeCritiche,
            icon: 'fa-exclamation-triangle',
            variant: 'danger',
            description: materiePrimeCritiche > 0 ? 'Richiede attenzione' : 'Nessuna criticità'
          },
          {
            title: 'Efficienza Produttiva',
            value: `${response.data.performance?.efficienza?.toFixed(1) || 0}%`,
            icon: 'fa-chart-line',
            variant: 'info',
            description: (response.data.performance?.efficienza || 0) > 80 ? 'Ottima efficienza' : 'Da migliorare',
            trend: (response.data.performance?.efficienza || 0) > 80 ? 'up' : 'down',
            percentage: (response.data.performance?.efficienza || 0)
          },
          {
            title: 'Tempo Medio Lavorazione',
            value: `${response.data.performance?.tempoMedio?.toFixed(0) || 0} min`,
            icon: 'fa-stopwatch',
            variant: 'primary',
            description: 'Per lavorazione'
          }
        ];
        
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        console.error('Errore nel caricamento delle statistiche:', err);
        
        // Visualizza informazioni di debug sull'errore
        if (err instanceof Error) {
          console.error('Dettaglio errore:', err.message);
          console.error('Stack:', err.stack);
        }
        
        // In caso di errore, mostra statistiche di default
        const defaultStats: StatData[] = [
          {
            title: 'Lavorazioni in Corso',
            value: 0,
            icon: 'fa-tasks',
            variant: 'primary',
            description: 'Dati non disponibili'
          },
          {
            title: 'Lavorazioni Completate',
            value: 0,
            icon: 'fa-check-circle',
            variant: 'success',
            description: 'Dati non disponibili'
          },
          {
            title: 'Lavorazioni in Attesa',
            value: 0,
            icon: 'fa-clock',
            variant: 'info',
            description: 'Dati non disponibili'
          },
          {
            title: 'Materie Prime Critiche',
            value: 0,
            icon: 'fa-exclamation-triangle',
            variant: 'warning',
            description: 'Dati non disponibili'
          }
        ];
        
        setError(err instanceof Error ? err.message : 'Impossibile caricare le statistiche');
        setStats(defaultStats);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Rendering condizionale in base allo stato
  if (loading) {
    return (
      <StatsPanelContainer>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </LoadingState>
      </StatsPanelContainer>
    );
  }
  
  if (error) {
    return (
      <StatsPanelContainer>
        <div className="alert alert-danger">
          <strong>Errore:</strong> {error}
          <details>
            <summary>Informazioni di debug</summary>
            <pre>{JSON.stringify(apiResponses, null, 2)}</pre>
          </details>
        </div>
      </StatsPanelContainer>
    );
  }
  
  return (
    <StatsPanelContainer>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} variant={stat.variant}>
            <div className="stat-icon">
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
            {stat.description && (
              <div className="stat-description">
                {stat.trend === 'up' && <i className="fas fa-arrow-up"></i>}
                {stat.trend === 'down' && <i className="fas fa-arrow-down"></i>}
                {stat.percentage !== undefined && stat.trend !== 'neutral' && (
                  <span>{stat.percentage}% </span>
                )}
                {stat.description}
              </div>
            )}
          </StatCard>
        ))}
      </StatsGrid>
    </StatsPanelContainer>
  );
};
