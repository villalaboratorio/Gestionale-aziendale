import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/endpoints/dashboardApi';
import { Lavorazione } from '../../../lavorazioni/types';
import {
  LavorazioniContainer,
  LavorazioniHeader,
  LavorazioniGrid,
  LavorazioneCard,
  StatusBadge,
  CardHeader,
  CardBody,
  ProcessInfo,
  TimeInfo,
  ActionButtons,
  FilterControls,
  EmptyState,
  LoadingState
} from './LavorazioniInCorso.styles';

export const LavorazioniInCorso: React.FC = () => {
  const [lavorazioni, setLavorazioni] = useState<Lavorazione[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStato, setFiltroStato] = useState<string>('in_corso');
  
  // Carica le lavorazioni
  useEffect(() => {
    const fetchLavorazioni = async () => {
      try {
        setLoading(true);
        setError(null); // Reset errore ad ogni nuova richiesta
        
        // Log per debug
        console.log("Recupero lavorazioni con filtro stato:", filtroStato);
        
        // Usa il nuovo endpoint della dashboard API
        const response = await dashboardApi.getDashboardLavorazioni(
          filtroStato !== 'all' ? filtroStato : undefined
        );
        
        // Log della risposta per debug
        console.log("Risposta API lavorazioni dashboard:", response);
        
        // Verifica successo
        if (!response.success) {
          throw new Error(response.message || 'Errore nel caricamento delle lavorazioni');
        }
        
        // Verifica struttura dati
        if (!Array.isArray(response.data)) {
          console.warn("Formato dati API non valido:", response.data);
          throw new Error('Formato dati non valido');
        }
        
        // Aggiorna stato con i dati ricevuti
        setLavorazioni(response.data || []);
        console.log("Lavorazioni caricate:", response.data.length);
      } catch (err) {
        // Gestione errore migliorata
        const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
        console.error('Errore fetch lavorazioni:', err);
        setError(`Errore nel caricamento delle lavorazioni: ${errorMessage}`);
        
        // Mantieni eventuali dati precedenti invece di resettare
        // setLavorazioni([]);
      } finally {
        // Termina sempre lo stato di caricamento, sia in caso di successo che di errore
        setLoading(false);
      }
    };
    
    fetchLavorazioni();
  }, [filtroStato]);
  
  // Funzione per calcolare lo stato di urgenza
  const getUrgenzaStatus = (lavorazione: Lavorazione) => {
    if (lavorazione.isUrgente) return 'urgent';
    if (lavorazione.prioritaCliente === 'alta') return 'high';
    return 'normal';
  };
  
  // Formatta data in formato locale con gestione robusta
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/D';
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      return date.toLocaleDateString('it-IT');
    } catch (error) {
      console.warn("Errore nel formato data:", error);
      return 'Data non valida';
    }
  };
  
  // Calcola giorni rimanenti con gestione errori
  const calcolaGiorniRimanenti = (dataConsegna: string | Date | undefined) => {
    if (!dataConsegna) return null;
    try {
      const oggi = new Date();
      const consegna = dataConsegna instanceof Date ? dataConsegna : new Date(dataConsegna);
      const diffTime = consegna.getTime() - oggi.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.warn("Errore nel calcolo giorni rimanenti:", error);
      return null;
    }
  };
  
  // Renderizzazione condizionale per loading
  if (loading) {
    return (
      <LavorazioniContainer>
        <LavorazioniHeader>
          <h2>Lavorazioni in Corso</h2>
        </LavorazioniHeader>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Caricamento lavorazioni...</p>
        </LoadingState>
      </LavorazioniContainer>
    );
  }
  
  // Renderizzazione condizionale per errore
  if (error) {
    return (
      <LavorazioniContainer>
        <LavorazioniHeader>
          <h2>Lavorazioni in Corso</h2>
        </LavorazioniHeader>
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => setFiltroStato(filtroStato)} // Trigger refresh
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Riprova
          </button>
        </div>
      </LavorazioniContainer>
    );
  }
  
  // Mapping di stati human-friendly per la visualizzazione
  const getStatoLabel = (codice: string) => {
    const mappingStati: Record<string, string> = {
      'in_corso': 'In corso',
      'in_attesa': 'In attesa',
      'completata': 'Completata',
      'all': 'Tutte'
    };
    return mappingStati[codice] || codice.replace('_', ' ');
  };
  
  return (
    <LavorazioniContainer>
      <LavorazioniHeader>
        <h2>Lavorazioni in Corso</h2>
        <FilterControls>
          <select 
            value={filtroStato} 
            onChange={(e) => setFiltroStato(e.target.value)}
            className="form-select form-select-sm"
            aria-label="Filtra per stato"
          >
            <option value="in_corso">In corso</option>
            <option value="in_attesa">In attesa</option>
            <option value="completata">Completate</option>
            <option value="all">Tutte</option>
          </select>
        </FilterControls>
      </LavorazioniHeader>
      
      {/* Mostra messaggio se non ci sono lavorazioni */}
      {lavorazioni.length === 0 ? (
        <EmptyState>
          <i className="fas fa-tasks fa-3x"></i>
          <p>Nessuna lavorazione {filtroStato === 'all' ? '' : getStatoLabel(filtroStato)}</p>
        </EmptyState>
      ) : (
        <LavorazioniGrid>
          {lavorazioni.map((lavorazione) => {
            const urgenza = getUrgenzaStatus(lavorazione);
            const giorniRimanenti = calcolaGiorniRimanenti(lavorazione.dataConsegnaPrevista);
            
            return (
              <LavorazioneCard key={lavorazione._id} urgenza={urgenza}>
                <CardHeader>
                  <div className="header-content">
                    <h3>{lavorazione.ricetta?.nome || 'Lavorazione'}</h3>
                    <StatusBadge stato={lavorazione.statoLavorazione?.codice || 'unknown'}>
                      {lavorazione.statoLavorazione?.nome || 'Stato sconosciuto'}
                    </StatusBadge>
                  </div>
                  <div className="scheda-number">
                    <span>Scheda #{lavorazione.numeroScheda}</span>
                  </div>
                </CardHeader>
                
                <CardBody>
                  <div className="cliente-info">
                    <i className="fas fa-building"></i>
                    <span>Cliente: {lavorazione.cliente?.nome || 'N/D'}</span>
                    {lavorazione.isUrgente && (
                      <span className="badge bg-danger ms-2">Urgente</span>
                    )}
                    {!lavorazione.isUrgente && lavorazione.prioritaCliente === 'alta' && (
                      <span className="badge bg-warning ms-2">Priorità Alta</span>
                    )}
                  </div>
                  
                  <ProcessInfo>
                    <div className="proceso-item">
                      <i className="fas fa-user"></i>
                      <span>Operatore: {lavorazione.operatore || 'Non assegnato'}</span>
                    </div>
                  </ProcessInfo>
                  
                  <TimeInfo>
                    <div className="time-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Inizio: {formatDate(lavorazione.dataLavorazione)}</span>
                    </div>
                    <div className="time-item">
                      <i className="fas fa-calendar-check"></i>
                      <span>Consegna: {formatDate(lavorazione.dataConsegnaPrevista)}</span>
                      {giorniRimanenti !== null && (
                        giorniRimanenti <= 0 ? (
                          <span className="badge bg-danger ms-2">Scaduta</span>
                        ) : giorniRimanenti <= 2 ? (
                          <span className="badge bg-warning ms-2">Tra {giorniRimanenti} giorni</span>
                        ) : null
                      )}
                    </div>
                  </TimeInfo>
                  
                  <ActionButtons>
                    <Link 
                      to={`/v2/lavorazione/${lavorazione._id}`} 
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-eye me-1"></i> Dettagli
                    </Link>
                  </ActionButtons>
                </CardBody>
              </LavorazioneCard>
            );
          })}
        </LavorazioniGrid>
      )}
    </LavorazioniContainer>
  );
};
