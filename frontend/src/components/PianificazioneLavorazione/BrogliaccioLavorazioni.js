import React from 'react';
import { usePianificazione } from './context/PianificazioneContext';
import './brogliaccio.css';

const BrogliaccioLavorazioni = () => {
    const { 
        lavorazioniParcheggiate,
        removeLavorazioneParcheggiata,
        updateLavorazioneParcheggiata,
        loadingStates,
        errors
    } = usePianificazione();

    const calcolaTotali = () => {
        return lavorazioniParcheggiate.reduce((acc, lav) => ({
            quantita: acc.quantita + lav.quantitaTotale,
            porzioni: acc.porzioni + lav.porzioniPreviste
        }), { quantita: 0, porzioni: 0 });
    };

    const handleQuantitaChange = async (id, value) => {
        try {
            const lavorazione = lavorazioniParcheggiate.find(lav => lav.id === id);
            if (!lavorazione) return;

            const porzioni = Math.floor((value * 1000) / lavorazione.grammiPerPorzione);
            await updateLavorazioneParcheggiata(id, {
                quantitaTotale: value,
                porzioniPreviste: porzioni
            });
        } catch (error) {
            console.error('Errore modifica quantità:', error);
        }
    };

    const handlePorzioniChange = async (id, porzioni) => {
        try {
            const lavorazione = lavorazioniParcheggiate.find(lav => lav.id === id);
            if (!lavorazione) return;

            const quantita = (porzioni * lavorazione.grammiPerPorzione) / 1000;
            await updateLavorazioneParcheggiata(id, {
                quantitaTotale: quantita,
                porzioniPreviste: porzioni
            });
        } catch (error) {
            console.error('Errore modifica porzioni:', error);
        }
    };

    return (
        <div className="brogliaccio-container">
            <div className="brogliaccio-header">
                <h3>Riepilogo Lavorazioni</h3>
                <span className="counter">
                    {lavorazioniParcheggiate.length} lavorazioni
                </span>
            </div>

            {errors.operazioni && (
                <div className="error-message">
                    {errors.operazioni}
                </div>
            )}

            <div className="lavorazioni-list">
                {lavorazioniParcheggiate.map(lav => (
                    <div key={lav.id} className="lavorazione-card">
                        <div className="card-header">
                            <span className="ricetta-nome">{lav.ricettaNome}</span>
                        </div>
                        
                        <div className="card-content">
                            <div className="input-group">
                                <div className="input-row">
                                    <label>Quantità (kg):</label>
                                    <input 
                                        type="number"
                                        value={lav.quantitaTotale}
                                        onChange={(e) => handleQuantitaChange(lav.id, parseFloat(e.target.value))}
                                        min="0"
                                        step="0.1"
                                        disabled={loadingStates.operazioni}
                                    />
                                </div>
                                <div className="input-row">
                                    <label>Porzioni:</label>
                                    <input 
                                        type="number"
                                        value={lav.porzioniPreviste}
                                        onChange={(e) => handlePorzioniChange(lav.id, parseInt(e.target.value))}
                                        min="0"
                                        disabled={loadingStates.operazioni}
                                    />
                                </div>
                            </div>

                            <div className="dettagli-grid">
                                <div className="dettaglio-item">
                                    <span className="dettaglio-label">g/Porzione</span>
                                    <span className="dettaglio-value">
                                        {lav.grammiPerPorzione}g
                                    </span>
                                </div>
                                <div className="dettaglio-item">
                                    <span className="dettaglio-label">Cliente</span>
                                    <span className="dettaglio-value">
                                        {lav.cliente}
                                    </span>
                                </div>
                                <div className="dettaglio-item">
                                    <span className="dettaglio-label">Lotto MP</span>
                                    <span className="dettaglio-value">
                                        {lav.materiaPrima.lotNumber}
                                    </span>
                                </div>
                            </div>

                            <button 
                                className="delete-btn"
                                onClick={() => removeLavorazioneParcheggiata(lav)}
                                disabled={loadingStates.operazioni}
                                title="Elimina lavorazione"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="totali-footer">
                <div className="totali-info">
                    <div className="totale-row">
                        <span className="totale-label">Totale Quantità:</span>
                        <span className="totale-value">
                            {calcolaTotali().quantita.toFixed(2)} kg
                        </span>
                    </div>
                    <div className="totale-row">
                        <span className="totale-label">Totale Porzioni:</span>
                        <span className="totale-value">
                            {calcolaTotali().porzioni}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrogliaccioLavorazioni;
