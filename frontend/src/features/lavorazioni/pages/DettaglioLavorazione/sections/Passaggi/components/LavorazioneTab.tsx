import * as React from 'react';
import { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useLavorazioniManager } from './hook/useLavorazioneManager';
import { PassaggioCard } from './PassaggioCard';
import { EventTimeline } from './EventTimeline';
import TabNav from '../../../components/TabNavWrapper';
import { LavorazioneEvent } from '../types/lavorazioni.types';

const LavorazioneTab: React.FC = () => {
  const {
    passaggiLavorazione,
    operatori,
    eventi,
    isDirty,
    isLoading,
    completionPercentage,
    handleStartPassaggio,
    handleCompletePassaggio,
    handleChangeOperatore,
    handleAddNote,
    handleSavePassaggi
  } = useLavorazioniManager();

  const [activeTab, setActiveTab] = useState('overview');

  // Filtra gli eventi per un passaggio specifico
  const getEventsByPassaggio = (passaggioId: string): LavorazioneEvent[] => {
    return eventi.filter(event => event.passaggioId === passaggioId);
  };

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
    }
  };

  return (
    <div className="lavorazione-tab">
      {/* Messaggio di modifiche non salvate */}
      {isDirty && (
        <div className="alert alert-warning mb-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Attenzione:</strong> Hai modifiche non salvate. Ricordati di salvare le modifiche.
          <button
            className="btn btn-primary btn-sm ms-3"
            onClick={handleSavePassaggi}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                Salvataggio...
              </>
            ) : (
              <>
                <i className="bi bi-save me-1"></i>
                Salva Modifiche
              </>
            )}
          </button>
        </div>
      )}

      {/* Barra di progresso */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Stato Lavorazione</h5>
          <span className="badge bg-primary">{completionPercentage}% Completato</span>
        </div>
        <div className="card-body">
          <ProgressBar 
            now={completionPercentage} 
            variant={completionPercentage < 30 ? "danger" : completionPercentage < 70 ? "warning" : "success"}
            label={`${completionPercentage}%`}
          />
        </div>
      </div>

      {/* Navigazione a tab */}
      <TabNav activeKey={activeTab} onSelect={handleTabSelect} className="mb-4">
        <TabNav.Item>
          <TabNav.Link eventKey="overview">Panoramica</TabNav.Link>
        </TabNav.Item>
        <TabNav.Item>
          <TabNav.Link eventKey="timeline">Cronologia Eventi</TabNav.Link>
        </TabNav.Item>
      </TabNav>

      {/* Contenuto della tab attiva */}
      <div className="tab-content">
        {/* Tab Panoramica */}
        {activeTab === 'overview' && (
          <div className="passaggi-container">
            {passaggiLavorazione.map(passaggio => (
              <PassaggioCard
                key={passaggio.id}
                passaggio={passaggio}
                operatori={operatori}
                eventi={getEventsByPassaggio(passaggio.id)}
                onStart={handleStartPassaggio}
                onComplete={handleCompletePassaggio}
                onChangeOperatore={handleChangeOperatore}
                onAddNote={handleAddNote}
              />
            ))}
          </div>
        )}

        {/* Tab Cronologia Eventi */}
        {activeTab === 'timeline' && (
          <div className="timeline-container">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cronologia Eventi</h5>
                <span className="badge bg-info">{eventi.length} Eventi</span>
              </div>
              <div className="card-body">
                {eventi.length > 0 ? (
                  <EventTimeline events={eventi} />
                ) : (
                  <div className="alert alert-info">
                    Nessun evento registrato. Inizia a lavorare sui passaggi per creare la cronologia.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LavorazioneTab;
