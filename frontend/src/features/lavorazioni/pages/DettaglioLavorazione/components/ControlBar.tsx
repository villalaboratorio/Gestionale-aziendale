import * as React from 'react';
import { useLavorazioneContext } from '../../../store/LavorazioneContext';
import { useNavigate } from 'react-router-dom';
import './ControlBar.css';

export const ControlBar: React.FC = () => {
  const { 
    data: { lavorazione },
    isNew,
    loadingStates: { operations: loading },
    actions
  } = useLavorazioneContext();
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    if (!lavorazione?._id) return;
    
    // Conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questa lavorazione? L\'operazione non può essere annullata.')) {
      try {
        await actions.handleDelete(lavorazione._id);
        navigate('/v2/lavorazioni');
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };
  
  return (
    <div className="control-bar">
      <div className="control-bar-status">
        {lavorazione?.statoLavorazione && (
          <span className={`status-badge status-${lavorazione.statoLavorazione.codice}`}>
            {lavorazione.statoLavorazione.nome}
          </span>
        )}
        {lavorazione?.numeroScheda && (
          <span className="scheda-badge">
            Scheda: {lavorazione.numeroScheda}
          </span>
        )}
      </div>
      
      <div className="control-bar-actions">
        <button 
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate('/v2/lavorazioni')}
        >
          <i className="fas fa-arrow-left me-1"></i> Indietro
        </button>
        
        {!isNew && (
          <button 
            className="btn btn-danger me-2"
            onClick={handleDelete}
            disabled={loading}
          >
            <i className="fas fa-trash-alt me-1"></i> Elimina
          </button>
        )}
        
        <button 
          className="btn btn-primary"
          onClick={() => actions.handleSave({})}
          disabled={loading || !lavorazione}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Salvataggio...
            </>
          ) : (
            <><i className="fas fa-save me-1"></i> Salva</>
          )}
        </button>
      </div>
    </div>
  );
};
