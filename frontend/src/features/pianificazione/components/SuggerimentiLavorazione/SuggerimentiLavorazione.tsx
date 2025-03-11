import React, { useEffect } from 'react';
import { Card } from '../../../../components/common/Card/Card'; 
import { usePianificazione } from '../../hooks/usePianificazione';
import { useSuggerimentiActions } from '../../hooks/useSuggerimentiActions';
import { useLavorazioniActions } from '../../hooks/useLavorazioniActions';
import { ISuggerimento } from '../../types/lavorazioni.types';
import { logger } from '../../../../core/Path/logging/logger';

interface SuggerimentoCardProps {
  suggerimento: ISuggerimento;
  onSelect: (suggerimento: ISuggerimento) => void;
}

const SuggerimentoCard: React.FC<SuggerimentoCardProps> = ({ suggerimento, onSelect }) => {
  const { ricetta, quantitaConsigliata, porzioniOttenibili, compatibilita } = suggerimento;
  
  return (
    <div className="suggerimento-card">
      <div className="card-header">
        <h4>{ricetta.nome}</h4>
        <span className="compatibilita">
          Compatibilità: {Math.round(compatibilita.score * 100)}%
        </span>
      </div>
      
      <div className="card-body">
        <div className="info-row">
          <span>Porzioni ottenibili:</span>
          <strong>{porzioniOttenibili}</strong>
        </div>
        <div className="info-row">
          <span>Quantità consigliata:</span>
          <strong>{quantitaConsigliata.toFixed(2)} kg</strong>
        </div>
        <div className="info-row">
          <span>Grammi per porzione:</span>
          <strong>{ricetta.grammiPerPorzione} g</strong>
        </div>
      </div>
      
      <div className="card-footer">
        <button 
          className="btn-select"
          onClick={() => onSelect(suggerimento)}
        >
          Seleziona
        </button>
      </div>
    </div>
  );
};

const SuggerimentiLavorazione: React.FC = () => {
  // Utilizziamo solo state dal context
  const { state } = usePianificazione();
  const { materiePrime, suggerimenti } = state;
  
  // Utilizziamo hook separati per le azioni
  // Rimuoviamo updateSuggerimentoQuantita dalla destrutturazione dato che non lo utilizziamo
  const { loadSuggerimenti, selectGruppo } = useSuggerimentiActions();
  const { addLavorazione } = useLavorazioniActions();
  
  useEffect(() => {
    if (materiePrime.selected) {
      console.log("ID materia prima selezionata:", materiePrime.selected._id);
      loadSuggerimenti(materiePrime.selected._id);
    }
  }, [materiePrime.selected, loadSuggerimenti]);
  
  const handleSelectSuggerimento = async (suggerimento: ISuggerimento) => {
    if (!materiePrime.selected) return;
    
    try {
      // Prepara i dati per la lavorazione
      const lavorazione = {
        ricettaId: suggerimento.ricetta._id,
        ricettaNome: suggerimento.ricetta.nome,
        materiaPrima: {
          id: materiePrime.selected._id,
          nome: materiePrime.selected.products[0].name,
          lotNumber: materiePrime.selected.products[0].lotNumber
        },
        quantitaTotale: suggerimento.quantitaConsigliata,
        porzioniPreviste: suggerimento.porzioniOttenibili,
        grammiPerPorzione: suggerimento.ricetta.grammiPerPorzione,
        cliente: materiePrime.selected.cliente.nome,
        clienteId: materiePrime.selected.cliente._id,
      };
      
      // Aggiungi la lavorazione
      await addLavorazione(lavorazione);
      
      logger.info(`Aggiunta nuova lavorazione per ${lavorazione.ricettaNome}`);
    } catch (error) {
      logger.error('Errore nell\'aggiunta della lavorazione', 
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };
  
  const handleGruppoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    selectGruppo(event.target.value);
  };
  
  // Logica per filtrare i suggerimenti in base al gruppo selezionato
  const suggerimentiFiltered = suggerimenti.selectedGruppo === 'tutti' 
    ? suggerimenti.items 
    : suggerimenti.gruppi[suggerimenti.selectedGruppo] || [];
  
  if (!materiePrime.selected) {
    return (
      <Card className="suggerimenti-container">
        <div className="empty-state">
          Seleziona una materia prima per vedere i suggerimenti
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="suggerimenti-container">
      <div className="header">
        <h3>Suggerimenti Lavorazioni</h3>
        
        <div className="controls">
          <select 
            value={suggerimenti.selectedGruppo} 
            onChange={handleGruppoChange}
            disabled={suggerimenti.loading}
          >
            <option value="tutti">Tutte le categorie</option>
            {Object.keys(suggerimenti.gruppi).map(gruppo => (
              <option key={gruppo} value={gruppo}>{gruppo}</option>
            ))}
          </select>
        </div>
      </div>
      
      {suggerimenti.loading && (
        <div className="loading-state">
          Caricamento suggerimenti...
        </div>
      )}
      
      {suggerimenti.error && (
        <div className="error-state">
          {suggerimenti.error}
        </div>
      )}
      
      {!suggerimenti.loading && suggerimentiFiltered.length === 0 && (
        <div className="empty-state">
          Nessun suggerimento disponibile
          {suggerimenti.selectedGruppo !== 'tutti' && (
            <span> per la categoria "{suggerimenti.selectedGruppo}"</span>
          )}
        </div>
      )}
      
      {!suggerimenti.loading && suggerimentiFiltered.length > 0 && (
        <div className="suggerimenti-grid">
          {suggerimentiFiltered.map(suggerimento => (
            <SuggerimentoCard 
              key={suggerimento.ricetta._id} 
              suggerimento={suggerimento}
              onSelect={handleSelectSuggerimento}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default SuggerimentiLavorazione;
