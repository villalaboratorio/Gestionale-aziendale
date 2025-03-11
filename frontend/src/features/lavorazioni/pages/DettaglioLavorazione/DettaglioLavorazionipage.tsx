import * as React from 'react';
import { useParams } from 'react-router-dom';
import { LavorazioneProvider, useLavorazioneContext } from '../../store/LavorazioneContext';
import TabNav from './components/TabNavWrapper';
import { ControlBar } from './components/ControlBar';
import './DettaglioLavorazione.css';
import { InfoTab } from './sections/InformazioniGenerali/InfoTab';
import CotturaTab from './sections/Cotture/components/CotturaTab';
// Importa il componente AssemblaggioTab
import AssemblaggioTab from './sections/Assemblaggio/AssemblaggioTab';
// Importa il componente LavorazioneTab
import LavorazioneTab from './sections/Passaggi/components/LavorazioneTab';
// Importa il componente AbbattimentoTab
import AbbattimentoTab from './sections/Abbattimento/AbbattimentoTab';

// Componente contenuto interno che usa il context
const DettaglioContent: React.FC = () => {
  const {
    data: { lavorazione },
    loadingStates: { main: loading },
    error: { main: error },
    activeTab,
    actions
  } = useLavorazioneContext();
  
  // Riferimento per tracciare se il caricamento iniziale è stato effettuato
  const initialLoadRef = React.useRef(false);
  const { id } = useParams<{ id: string }>();
  
  // Effetto per il caricamento iniziale
  React.useEffect(() => {
    if (!initialLoadRef.current && id && id !== 'new') {
      initialLoadRef.current = true;
      actions.fetchData(id);
    }
  }, [id, actions]);
  
  if (loading) {
    return <div className="loading-container">Caricamento dettaglio lavorazione...</div>;
  }
  
  if (error) {
    return <div className="error-container">Errore: {error}</div>;
  }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      actions.setActiveTab(key);
    }
  };
  
  return (
    <div className="dettaglio-lavorazione-container">
      <header className="dettaglio-header">
        <h1 className="dettaglio-title">
          {id === 'new' ? 'Nuova Lavorazione' : `Lavorazione: ${lavorazione?.ricetta?.nome || 'N/D'}`}
        </h1>
        {id !== 'new' && <p className="dettaglio-id">ID: {lavorazione?._id || 'N/D'}</p>}
      </header>
      <ControlBar />
      <TabNav activeKey={activeTab} onSelect={handleTabSelect} className="mb-4">
        <TabNav.Item>
          <TabNav.Link eventKey="info">Informazioni</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="ingredienti">Ingredienti</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="lavorazioni">Passaggi</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="assemblaggio">Assemblaggio</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="cottura">Cottura</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="abbattimento">Abbattimento</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="confezionamento">Confezionamento</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="report">Report</TabNav.Link>
        </TabNav.Item>
      </TabNav>
      
      <div className="tab-content">
        {activeTab === 'info' && <InfoTab />}
        
        {activeTab === 'ingredienti' && (
          <div className="ingredienti-tab">
            <div className="card">
              <div className="card-header">
                <h3 className="m-0">Ingredienti</h3>
              </div>
              <div className="card-body">
                <p>Implementazione futura</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Lavorazioni gestita dal componente LavorazioneTab */}
        {activeTab === 'lavorazioni' && <LavorazioneTab />}

        {/* Inseriamo il componente AssemblaggioTab per la tab assemblaggio */}
        {activeTab === 'assemblaggio' && <AssemblaggioTab />}

        {/* Tab Cottura gestita dal componente CotturaTab */}
        {activeTab === 'cottura' && <CotturaTab />}
        
        {/* Tab Abbattimento gestita dal componente AbbattimentoTab */}
        {activeTab === 'abbattimento' && <AbbattimentoTab />}

        {/* Placeholder per le altre tab */}
        {['confezionamento', 'report'].includes(activeTab) && (
          <div className="card">
            <div className="card-header">
              <h3 className="m-0">Tab {activeTab}</h3>
            </div>
            <div className="card-body">
              <p>Contenuto in arrivo nella milestone futura</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente wrapper che fornisce il context
export const DettaglioLavorazionePage: React.FC = () => {
  console.log("🟢 RENDERING DETTAGLIO LAVORAZIONE");
  
  return (
    <LavorazioneProvider>
      <DettaglioContent />
    </LavorazioneProvider>
  );
};
