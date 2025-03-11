import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Layout from './components/Layout';
import { DashboardContainer } from './features/lavorazioni/dashboard/components/DashboardContainer';
import { DettaglioLavorazionePage } from './features/lavorazioni/pages/DettaglioLavorazione/DettaglioLavorazionipage';
import { PianificazioneContainer } from './features/pianificazione/components/PianificazioneContainer';
import { Dashboard } from './features/dashboard/page/Dashboard';  // Importiamo la nuova Dashboard

export const ModernApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          {/* Aggiungiamo la rotta per la nuova Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Rotte esistenti */}
          <Route path="lavorazioni" element={<DashboardContainer />} />
          <Route path="lavorazione/:id" element={<DettaglioLavorazionePage />} />
          <Route path="pianificazione" element={<PianificazioneContainer />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export default ModernApp;
