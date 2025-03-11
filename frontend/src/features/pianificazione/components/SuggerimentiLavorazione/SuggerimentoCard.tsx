import React from 'react';
import { ISuggerimento } from '../../types/lavorazioni.types';
import { IValidazione, ICompatibilita } from '../../types/lavorazioni.types';

// Definisci l'interfaccia delle props
export interface SuggerimentoCardProps {
  suggerimento: ISuggerimento;
  compatibilityStatus: 'high' | 'medium' | 'low';
  onQuantitaChange: (ricettaId: string, field: string, value: number) => void;
  onConfirm: (suggerimento: ISuggerimento) => void;
  showPreview: boolean;
  loading: boolean; // Manteniamo loading come boolean per semplicità
  validazione?: IValidazione;
  compatibilita?: ICompatibilita;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Definisci il componente con destrutturazione corretta delle props
const SuggerimentoCard: React.FC<SuggerimentoCardProps> = ({
  suggerimento,
  compatibilityStatus,
  onQuantitaChange,
  onConfirm,
  showPreview,
  loading, // Usa loading invece di loadingStates 
  validazione,
  compatibilita,
  onMouseEnter,
  onMouseLeave
}) => {
  const renderValidationMessage = () => {
    if (validazione && !validazione.valido) {
      return (
        <div className="validation-message error">
          {validazione.messaggio || 'Errore di validazione'}
        </div>
      );
    }
    if (compatibilita && compatibilita.score < 1) {
      return (
        <div className="validation-message warning">
          Match parziale ({(compatibilita.score * 100).toFixed(0)}%)
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`suggerimento-card compatibility-${compatibilityStatus}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="suggerimento-header">
        <h4>{suggerimento.ricetta.nome}</h4>
        <span className={`tipo-badge ${compatibilityStatus}`}>
          {suggerimento.ricetta.tipo || 'Altro'}
        </span>
      </div>
      
      {renderValidationMessage()}

      <div className="suggerimento-dettagli">
        <div className="input-group">
          <div className="input-row">
            <label>Numero Porzioni:</label>
            <input 
              type="number"
              value={suggerimento.porzioniSelezionate || ''}
              onChange={(e) => onQuantitaChange(
                suggerimento.ricetta._id, 
                'porzioni', 
                parseInt(e.target.value)
              )}
              min="1"
              max={suggerimento.porzioniOttenibili}
              disabled={loading}
              className={validazione?.codice === 'INVALID_PORTIONS' ? 'error' : ''}
            />
          </div>
          <div className="input-row">
            <label>Grammi per Porzione:</label>
            <input 
              type="number"
              value={suggerimento.grammiPerPorzioneSelezionati || suggerimento.ricetta.grammiPerPorzione || ''}
              onChange={(e) => onQuantitaChange(
                suggerimento.ricetta._id, 
                'grammiPerPorzione', 
                parseInt(e.target.value)
              )}
              min="1"
              disabled={loading}
              className={validazione?.codice === 'INVALID_GRAMS' ? 'error' : ''}
            />
          </div>
        </div>
        <div className="quantita-indicatori">
          <div className="quantita-row">
            <span>Quantità Totale:</span>
            <strong>
              {(suggerimento.quantitaCalcolata || suggerimento.quantitaConsigliata).toFixed(2)} kg
            </strong>
          </div>
          <div className="quantita-row">
            <span>Porzioni Ottenibili:</span>
            <strong>{suggerimento.porzioniOttenibili}</strong>
          </div>
        </div>
        <button 
          className={`conferma-btn status-${compatibilityStatus}`}
          onClick={() => onConfirm(suggerimento)}
          disabled={!validazione?.valido || loading}
        >
          {loading ? 'Elaborazione...' : 'Conferma Lavorazione'}
        </button>
      </div>

      {showPreview && suggerimento.ricetta.ingredienti && (
        <div className="preview-ingredienti">
          <h5>Ingredienti:</h5>
          <ul>
            {suggerimento.ricetta.ingredienti.map((ing, index) => (
              <li key={index}>
                {ing.ingrediente.name}: {ing.quantita} {ing.unitaMisura.abbreviation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuggerimentoCard;
