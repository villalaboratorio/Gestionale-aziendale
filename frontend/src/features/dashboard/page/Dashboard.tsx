import React from 'react';
import { GiacenzaMateriePrime } from '../components/GiacenzaMateriePrime';
import { StatsPanel } from '../components/StatsPanel';
import { ScheduleTimeline } from '../components/ScheduleTimeline';
import { LavorazioniInCorso } from '../components/LavorazioniInCorso'; // Aggiungi questa importazione
import {
  DashboardContainer,
  DashboardHeader,
  HeaderTitle,
  HeaderActions,
  ActionButton,
  TwoColumnLayout,
  MainColumn,
  SideColumn,
  // ContentSection - non lo importiamo se non viene utilizzato
} from './Dashboard.styles';

// L'utente attuale (dovrà essere recuperato da un context/stato)
const currentUser = {
  name: 'Mario Rossi',
  role: 'Responsabile Produzione'
};

// Formatta la data di oggi in italiano
const today = new Date().toLocaleDateString('it-IT', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderTitle>
          <h1>Dashboard Operativa</h1>
          <p>Benvenuto, {} | {today}</p>
        </HeaderTitle>
        <HeaderActions>
          <ActionButton>
            <i className="fas fa-sync-alt"></i>
            Aggiorna
          </ActionButton>
          <ActionButton className="primary">
            <i className="fas fa-plus"></i>
            Nuova Lavorazione
          </ActionButton>
        </HeaderActions>
      </DashboardHeader>
      
      {/* Pannello KPI e statistiche */}
      <StatsPanel />
      
      <TwoColumnLayout>
        <MainColumn>
          {/* Timeline delle attività */}
          <ScheduleTimeline />
          <LavorazioniInCorso />
          {/* Se in futuro avrai bisogno di aggiungere un altro componente, 
              potrai importare e utilizzare ContentSection */}
        </MainColumn>
        
        <SideColumn>
          {/* Giacenza materie prime */}
          <GiacenzaMateriePrime />
          
          {/* Spazio per altri widget secondari */}
        </SideColumn>
      </TwoColumnLayout>
    </DashboardContainer>
  );
};
