import * as React from 'react';
import { Lavorazione, InitialCollections } from '../../../../../lavorazioni/types/models.types';
import './InfoTab.css';

// Usiamo Partial<Lavorazione> per il form
type FormLavorazione = Partial<Lavorazione>;

interface InfoTabContentProps {
  formData: FormLavorazione;
  collections: InitialCollections | null;
  isDirty: boolean;
  saving: boolean;
  onSave: () => void;
  onChange: (field: keyof FormLavorazione, value: unknown) => void;
  isLoading: boolean;
}

export const InfoTabContent: React.FC<InfoTabContentProps> = ({
  formData,
  collections,
  isDirty,
  saving,
  onSave,
  onChange,
  isLoading
}) => {
  if (isLoading || !collections) {
    return (
      <div className="info-tab">
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

  // Helper functions per gestire in sicurezza le selezioni
  const handleClienteChange = (clienteId: string): void => {
    const clienteObj = collections.clienti.find(c => c._id === clienteId);
    onChange('cliente', clienteObj || undefined);
  };

  const handleRicettaChange = (ricettaId: string): void => {
    const ricettaObj = collections.ricette.find(r => r._id === ricettaId);
    onChange('ricetta', ricettaObj || undefined);
  };

  const handleStatoChange = (statoId: string): void => {
    const statoObj = collections.statiLavorazione.find(s => s._id === statoId);
    onChange('statoLavorazione', statoObj || undefined);
  };

  const handleTipoChange = (tipoId: string): void => {
    const tipoObj = collections.tipiLavorazione.find(t => t._id === tipoId);
    onChange('tipoLavorazione', tipoObj || undefined);
  };

  const handlePrioritaChange = (priorita: string): void => {
    const value = priorita === '' ? undefined : priorita as 'bassa' | 'media' | 'alta';
    onChange('prioritaCliente', value);
  };

  return (
    <div className="info-tab">
      <div className="info-tab-grid">
        {/* Prima colonna: Dati principali */}
        <div className="card info-card mb-3">
          <div className="card-header">
            <h3 className="card-title">Informazioni Lavorazione</h3>
          </div>
          <div className="card-body">
            <div className="form-row mb-3">
              <div className="col-6">
                <label htmlFor="numeroScheda" className="form-label">Codice Scheda</label>
                <input
                  type="text"
                  className="form-control"
                  id="numeroScheda"
                  value={formData.numeroScheda || ''}
                  onChange={(e) => onChange('numeroScheda', e.target.value)}
                />
              </div>
              <div className="col-6">
  <label htmlFor="operatore" className="form-label">Operatore</label>
  <select
    className="form-select"
    id="operatore"
    value={formData.operatore || ''}
    onChange={(e) => onChange('operatore', e.target.value)}
  >
    <option value="">Seleziona operatore</option>
    {collections.quantityTypes && collections.quantityTypes.map(type => (
      <option key={type._id} value={type.name}>
        {type.name} ({type.abbreviation})
      </option>
    ))}
  </select>
</div>
            </div>

            <div className="form-row mb-3">
              <div className="col-6">
                <label htmlFor="cliente" className="form-label">Cliente</label>
                <select
                  className="form-select"
                  id="cliente"
                  value={formData.cliente?._id || ''}
                  onChange={(e) => handleClienteChange(e.target.value)}
                >
                  <option value="">Seleziona un cliente</option>
                  {collections.clienti.map(cliente => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="ricetta" className="form-label">Ricetta</label>
                <select
                  className="form-select"
                  id="ricetta"
                  value={formData.ricetta?._id || ''}
                  onChange={(e) => handleRicettaChange(e.target.value)}
                >
                  <option value="">Seleziona una ricetta</option>
                  {collections.ricette.map(ricetta => (
                    <option key={ricetta._id} value={ricetta._id}>
                      {ricetta.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="col-6">
                <label htmlFor="tipoLavorazione" className="form-label">Tipo Lavorazione</label>
                <select
                  className="form-select"
                  id="tipoLavorazione"
                  value={formData.tipoLavorazione?._id || ''}
                  onChange={(e) => handleTipoChange(e.target.value)}
                >
                  <option value="">Seleziona un tipo</option>
                  {collections.tipiLavorazione.map(tipo => (
                    <option key={tipo._id} value={tipo._id}>
                      {tipo.nome || tipo.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label htmlFor="statoLavorazione" className="form-label">Stato</label>
                <select
                  className="form-select"
                  id="statoLavorazione"
                  value={formData.statoLavorazione?._id || ''}
                  onChange={(e) => handleStatoChange(e.target.value)}
                >
                  <option value="">Seleziona uno stato</option>
                  {collections.statiLavorazione.map(stato => (
                    <option key={stato._id} value={stato._id}>
                      {stato.nome || stato.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Seconda colonna: Dati aggiuntivi e Urgenza */}
        <div className="card info-card mb-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title">Priorità e Tempistiche</h3>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isUrgente"
                checked={formData.isUrgente || false}
                onChange={(e) => onChange('isUrgente', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isUrgente">
                <span className={`badge ${formData.isUrgente ? 'bg-danger' : 'bg-secondary'}`}>
                  {formData.isUrgente ? 'URGENTE' : 'Standard'}
                </span>
              </label>
            </div>
          </div>
          <div className="card-body">
            <div className="form-row mb-3">
              <div className="col-6">
                <label htmlFor="dataConsegnaPrevista" className="form-label">Data Consegna</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataConsegnaPrevista"
                  value={typeof formData.dataConsegnaPrevista === 'string' ? formData.dataConsegnaPrevista : ''}
                  onChange={(e) => onChange('dataConsegnaPrevista', e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="prioritaCliente" className="form-label">Priorità Cliente</label>
                <select
                  className="form-select"
                  id="prioritaCliente"
                  value={formData.prioritaCliente || ''}
                  onChange={(e) => handlePrioritaChange(e.target.value)}
                >
                  <option value="">Seleziona priorità</option>
                  <option value="bassa">Bassa</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
            
            {formData.isUrgente && (
              <div className="form-row mt-3">
                <div className="col-12">
                  <label htmlFor="motivazioneUrgenza" className="form-label">Motivazione Urgenza</label>
                  <textarea
                    className="form-control"
                    id="motivazioneUrgenza"
                    rows={2}
                    value={formData.motivazioneUrgenza || ''}
                    onChange={(e) => onChange('motivazioneUrgenza', e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scheda inferiore: Note */}
      <div className="card info-card-full mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">Note e Annotazioni</h3>
          {isDirty && (
            <button 
              className="btn btn-primary save-btn" 
              onClick={onSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Salvataggio...
                </>
              ) : 'Salva Modifiche'}
            </button>
          )}
        </div>
        <div className="card-body">
          <div className="form-row mb-3">
            <div className="col-6">
              <label htmlFor="noteProduzione" className="form-label">Note Produzione</label>
              <textarea
                className="form-control"
                id="noteProduzione"
                rows={3}
                value={formData.noteProduzione || ''}
                onChange={(e) => onChange('noteProduzione', e.target.value)}
              ></textarea>
            </div>
            <div className="col-6">
              <label htmlFor="noteAllergeni" className="form-label">Note Allergeni</label>
              <textarea
                className="form-control"
                id="noteAllergeni"
                rows={3}
                value={formData.noteAllergeni || ''}
                onChange={(e) => onChange('noteAllergeni', e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="form-row">
            <div className="col-12">
              <label htmlFor="noteConfezionamento" className="form-label">Note Confezionamento</label>
              <textarea
                className="form-control"
                id="noteConfezionamento"
                rows={2}
                value={formData.noteConfezionamento || ''}
                onChange={(e) => onChange('noteConfezionamento', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
