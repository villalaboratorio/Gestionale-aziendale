import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMonitoring } from '../../hooks/useMonitoring';
import { StatoCottura } from '../../../types/models.types';
import { CotturaTimer } from '../../../pages/DettaglioLavorazione/sections/Cotture/components/CotturaTimer/CotturaTimer';
import {
  MonitorCard,
  MonitorHeader,
  CookingList,
  CookingItemCard,
  SchemaLabel,
  CookingItemRow,
  ViewButton,
  EmptyState,
  LoadingState,
  ErrorMessage
} from './CookingMonitorPanel.styles';

// Funzione utility per gestire tipoCottura che può essere sia string che object
const getTipoCotturaName = (tipoCottura: string | { nome: string }): string => {
  if (typeof tipoCottura === 'string') {
    return tipoCottura;
  }
  return tipoCottura.nome;
};

export const CookingMonitorPanel: React.FC = () => {
  const navigate = useNavigate();
  const { activeCooking, loading, error, refresh } = useMonitoring();
  
  // Funzione per convertire la stringa dello stato in StatoCottura enum
  const mapStatoToEnum = (statoString: string): StatoCottura => {
    switch(statoString) {
      case 'in_corso':
        return StatoCottura.IN_CORSO;
      case 'completata':
        return StatoCottura.COMPLETATA;
      case 'non_iniziata':
      default:
        return StatoCottura.NON_INIZIATA;
    }
  };
  
  if (loading) {
    return (
      <MonitorCard>
        <MonitorHeader>
          <i className="fas fa-fire"></i>
          <h4>Cotture in Corso</h4>
        </MonitorHeader>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Caricamento dati cotture...</p>
        </LoadingState>
      </MonitorCard>
    );
  }
  
  if (error) {
    return (
      <MonitorCard>
        <MonitorHeader>
          <i className="fas fa-fire"></i>
          <h4>Cotture in Corso</h4>
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
        <i className="fas fa-fire"></i>
        <h4>Cotture in Corso</h4>
      </MonitorHeader>
      
      {activeCooking && activeCooking.length > 0 ? (
        <CookingList>
          {activeCooking.map(item => (
            <CookingItemCard key={item.lavorazioneId}>
              <div>
                <SchemaLabel>{item.numeroScheda}</SchemaLabel>
                <h5>{item.ricettaNome || 'Lavorazione'}</h5>
                <p>Cotture: {item.cotture.length}</p>
              </div>
              
              {item.cotture.map(cottura => (
                <CookingItemRow key={cottura._id}>
                  <div>
                    <p>{getTipoCotturaName(cottura.tipoCottura)}</p>
                    <p>Target: {cottura.temperaturaTarget}°C</p>
                  </div>
                  <CotturaTimer 
                    cotturaId={cottura._id}
                    stato={mapStatoToEnum(cottura.stato)}
                    inizio={cottura.inizio}
                    cottureAttive={true}
                  />
                </CookingItemRow>
              ))}
              
              <ViewButton onClick={() => navigate(`/v2/lavorazione/${item.lavorazioneId}`)}>
                Visualizza
              </ViewButton>
            </CookingItemCard>
          ))}
        </CookingList>
      ) : (
        <EmptyState>
          <i className="fas fa-info-circle"></i>
          <p>Nessuna cottura in corso</p>
        </EmptyState>
      )}
    </MonitorCard>
  );
};
