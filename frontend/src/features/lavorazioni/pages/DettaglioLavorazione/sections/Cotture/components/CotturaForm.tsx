import * as React from 'react';
import { TipoCottura, Cottura } from '../../../../../types/models.types';
import { useCotturaForm } from '../hooks/useCotturaForm';
import { FormField } from './CotturaFormField';
import { cotturaUtils } from '../utils/cotturaUtils';

interface CotturaFormProps {
  cottura: Cottura | null;
  isNew: boolean;
  onSave: (cotturaData: Cottura) => void;
  onCancel: () => void;
  tipiCottura: TipoCottura[];
  loading: boolean;
}

const CotturaForm: React.FC<CotturaFormProps> = ({
  cottura,
  isNew,
  onSave,
  onCancel,
  tipiCottura,
  loading
}) => {
  const {
    formData,
    suggestedValues,
    errors,
    operatori,
    handleChange,
    handleSubmit
  } = useCotturaForm({ cottura, isNew, onSave, tipiCottura });

  // Funzione per mostrare le informazioni sul tempo suggerito con formattazione
  const renderTempoSuggerito = () => {
    if (suggestedValues.tempoCottura === undefined || 
        Number(formData.tempoCottura) === suggestedValues.tempoCottura) {
      return <small className="text-muted">Tempo in minuti (max 24 ore)</small>;
    }
    
    // Usa cotturaUtils per formattare il tempo suggerito in formato HH:MM
    const secondiSuggeriti = cotturaUtils.minutiToSecondi(suggestedValues.tempoCottura);
    const formatoLeggibile = cotturaUtils.formatTime(secondiSuggeriti);
    
    return (
      <span className="text-info">
        <i className="bi bi-info-circle me-1"></i>
        Tempo consigliato: {suggestedValues.tempoCottura} min ({formatoLeggibile})
      </span>
    );
  };

  // Funzione per mostrare le informazioni sulla temperatura suggerita
  const renderTemperaturaSuggerita = () => {
    if (suggestedValues.temperatura === undefined || 
        Number(formData.temperatura) === suggestedValues.temperatura) {
      return null;
    }
    
    return (
      <span className="text-info">
        <i className="bi bi-info-circle me-1"></i>
        Temperatura consigliata: {suggestedValues.temperatura}°C
      </span>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="cottura-form">
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info mb-3" style={{ fontSize: '11px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
          <details>
            <summary>Debug: Form State</summary>
            <pre style={{ fontSize: '10px' }}>
              {JSON.stringify({ formData, suggestedValues, errors }, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      <div className="row g-3">
        {/* Tipo Cottura */}
        <div className="col-md-6">
          <FormField
            id="tipoCottura"
            label="Tipo Cottura"
            required
            error={errors.tipoCottura}
          >
            <select
              id="tipoCottura"
              name="tipoCottura"
              className={`form-select ${errors.tipoCottura ? 'is-invalid' : ''}`}
              value={formData.tipoCotturaId}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Seleziona tipo cottura...</option>
              {tipiCottura.map(tipo => (
                <option key={tipo._id} value={tipo._id}>
                  {cotturaUtils.getNome(tipo)}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        
        {/* Temperatura */}
        <div className="col-md-6">
          <FormField
            id="temperatura"
            label="Temperatura Target (°C)"
            required
            error={errors.temperatura}
            helpText={renderTemperaturaSuggerita()}
          >
            <input
              type="number"
              id="temperatura"
              name="temperatura"
              className={`form-control ${errors.temperatura ? 'is-invalid' : ''}`}
              value={formData.temperatura}
              onChange={handleChange}
              min="0"
              max="500"
              disabled={loading}
              required
            />
          </FormField>
        </div>
        
        {/* Tempo Cottura */}
        <div className="col-md-6">
          <FormField
            id="tempoCottura"
            label="Tempo Cottura (minuti)"
            required
            error={errors.tempoCottura}
            helpText={renderTempoSuggerito()}
          >
            <input
              type="number"
              id="tempoCottura"
              name="tempoCottura"
              className={`form-control ${errors.tempoCottura ? 'is-invalid' : ''}`}
              value={formData.tempoCottura}
              onChange={handleChange}
              min="1"
              max="1440"
              disabled={loading}
              required
            />
          </FormField>
        </div>
        
        {/* Addetto */}
        <div className="col-md-6">
          <FormField
            id="addetto"
            label="Addetto"
            required
            error={errors.addetto}
            helpText={operatori.length === 0 ? (
              <span className="text-warning">
                <i className="bi bi-exclamation-triangle me-1"></i>
                Nessun operatore disponibile. Verifica la configurazione.
              </span>
            ) : null}
          >
            <select
              id="addetto"
              name="addetto"
              className={`form-select ${errors.addetto ? 'is-invalid' : ''}`}
              value={formData.addetto}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Seleziona addetto...</option>
              {operatori.map(op => (
                <option key={op._id} value={op.name}>
                  {op.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        
        {/* Suggerimenti */}
        {(suggestedValues.temperatura !== undefined || suggestedValues.tempoCottura !== undefined) && (
          <div className="col-12">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <i className="bi bi-lightbulb-fill me-2"></i>
              <div>
                <strong>Suggerimento:</strong> I valori consigliati derivano dalla ricetta selezionata.
                {formData.tipoCottura && (
                  <span className="ms-1">
                    Il tempo medio per <strong>{cotturaUtils.getNome(formData.tipoCottura)}</strong> è di {
                      cotturaUtils.secondiToMinuti(cotturaUtils.getTempoMedio(formData.tipoCottura))
                    } minuti.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Note informative */}
        <div className="col-12">
          <div className="form-text mb-3">
            I campi contrassegnati con <span className="text-danger">*</span> sono obbligatori
          </div>
        </div>
        
        {/* Riepilogo tempo cottura (usa cotturaUtils) */}
        {formData.tempoCottura && (
          <div className="col-12">
            <div className="card bg-light mb-3">
              <div className="card-body py-2">
                <small>
                  Tempo impostato: <strong>{formData.tempoCottura} minuti</strong> (
                  {cotturaUtils.formatTime(cotturaUtils.minutiToSecondi(formData.tempoCottura))})
                </small>
              </div>
            </div>
          </div>
        )}
        
        {/* Pulsanti */}
        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="bi bi-x-circle me-1"></i>
            Annulla
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvataggio...
              </>
            ) : (
              <>
                <i className="bi bi-save me-1"></i>
                Salva
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CotturaForm;
