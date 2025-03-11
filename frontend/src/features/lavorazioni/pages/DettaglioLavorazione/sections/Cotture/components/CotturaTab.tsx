import React from 'react';
import CotturaList from './CotturaList';
import CotturaForm from './CotturaForm';
import InterruzioneCotturaModal from './InterruzioneCotturaModal';
import './CotturaTabs.css';
import { useCottureManager } from '../hooks/useCottureManager';
import { StatoCottura } from '../../../../../types/models.types';

const CotturaTab: React.FC = () => {
  // Utilizziamo l'hook che contiene tutta la logica
  const {
    // Dati
    lavorazione,
    collections,
    saving,
    tipiCottura,
    cotture,
    
    // Stati
    isAddMode,
    selectedCottura,
    showInterruptModal,
    
    // Funzioni di gestione stati
    setShowInterruptModal,
    setCotturaToInterrupt,
    
    // Funzioni di azione
    handleAddCottura,
    handleEditCottura,
    handleCancel,
    handleSaveCottura,
    handleStartCottura,
    handleRequestInterrupt,
    handleInterruptCottura,
    handleCompleteCottura,
    handleDeleteCottura,
    importCottureFromRicetta
  } = useCottureManager();

  // Verifica se ci sono cotture in corso (che necessitano di salvataggio)
  const hasPendingCotture = React.useMemo(() => {
    return cotture.some(c => c.stato === StatoCottura.IN_CORSO);
  }, [cotture]);

  // Loading state
  if (!lavorazione || !collections) {
    return (
      <div className="cottura-tab">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
            <p className="mt-3 text-muted">Caricamento dati in corso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cottura-tab">
      {/* Avviso cotture in corso che richiedono salvataggio */}
      {hasPendingCotture && (
        <div className="alert alert-warning mb-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Attenzione:</strong> Hai cotture in corso. Ricordati di salvare la lavorazione usando il pulsante "Salva" nella parte superiore della pagina.
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestione Cotture</h5>
          {!isAddMode && (
            <div className="d-flex">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddCottura}
                disabled={saving}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Aggiungi Cottura
              </button>

              {/* Pulsante per importare cotture dalla ricetta */}
              <button
                className="btn btn-outline-secondary btn-sm ms-2"
                onClick={importCottureFromRicetta}
                disabled={saving}
                title="Importa le cotture definite nella ricetta"
              >
                <i className="bi bi-cloud-download me-1"></i>
                Importa da Ricetta
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          {isAddMode ? (
            <CotturaForm
              cottura={selectedCottura}
              isNew={!selectedCottura}
              onSave={handleSaveCottura}
              onCancel={handleCancel}
              tipiCottura={tipiCottura}
              loading={saving}
            />
          ) : (
            <CotturaList
              cotture={cotture}
              onEdit={handleEditCottura}
              onDelete={handleDeleteCottura}
              onStart={handleStartCottura}
              onInterrupt={handleRequestInterrupt}
              onComplete={handleCompleteCottura}
              loading={saving}
            />
          )}
        </div>
      </div>
      
      {/* Modal per interruzione cottura */}
      <InterruzioneCotturaModal
        isOpen={showInterruptModal}
        onConfirm={handleInterruptCottura}
        onClose={() => {
          setShowInterruptModal(false);
          setCotturaToInterrupt(null);
        }}
      />
    </div>
  );
};

export default CotturaTab;
