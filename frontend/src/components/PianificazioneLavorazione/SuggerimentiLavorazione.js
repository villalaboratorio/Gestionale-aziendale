import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePianificazione } from './context/PianificazioneContext';
import Select from '../common/Select/Select';
import axios from 'axios';
import './SuggerimentiLavorazione.css';
import LavorazioneLibera from '../LavorazioneLibera';

import { 
    calcolaSuggerimentiRicette, 
    calcolaCompatibilita, 
    raggruppaRicettePerTipo,
    preparaNuovaLavorazione 
} from './utils/calculations';
import { 
    validaSuggerimento, 
    validaPorzioni, 
    validaGrammiPerPorzione, 
    validaRicettaCompatibile 
} from './utils/validations';
import SuggerimentoCard from './components/SuggerimentoCard';

const SuggerimentiLavorazione = () => {
    const navigate = useNavigate();
    const {
        selectedMateriaPrima,
        addLavorazioneParcheggiata,
        getQuantityTracking,
        loadingStates,
        errors
    } = usePianificazione();

    const [suggerimenti, setSuggerimenti] = useState([]);
    const [gruppiRicette, setGruppiRicette] = useState({});
    const [selectedGruppo, setSelectedGruppo] = useState('tutti');
    const [previewRicettaId, setPreviewRicettaId] = useState(null);
    const [showLavorazioneLibera, setShowLavorazioneLibera] = useState(false);

    const handleQuantitaChange = useCallback((ricettaId, field, value) => {
        setSuggerimenti(prev => prev.map(sugg => {
            if (sugg.ricetta._id !== ricettaId) return sugg;
            
            const updatedSugg = { ...sugg };
            let validationResult;

            if (field === 'porzioni') {
                validationResult = validaPorzioni(value, sugg.porzioniOttenibili);
                if (validationResult.valido) {
                    updatedSugg.porzioniSelezionate = value;
                    updatedSugg.quantitaCalcolata = (value * sugg.ricetta.grammiPerPorzione) / 1000;
                }
            } else if (field === 'grammiPerPorzione') {
                validationResult = validaGrammiPerPorzione(value);
                if (validationResult.valido) {
                    updatedSugg.grammiPerPorzioneSelezionati = value;
                    updatedSugg.quantitaCalcolata = (sugg.porzioniSelezionate * value) / 1000;
                }
            }

            const validazioneSuggerimento = validaSuggerimento(updatedSugg, selectedMateriaPrima.quantitaResidua);
            updatedSugg.validazione = validazioneSuggerimento;
            
            const compatibilita = validaRicettaCompatibile(selectedMateriaPrima, sugg.ricetta);
            updatedSugg.compatibilita = compatibilita;

            return updatedSugg;
        }));
    }, [selectedMateriaPrima]);

    const handleConfermaSuggerimento = async (suggerimento) => {
        try {
            const validazione = validaSuggerimento(suggerimento, selectedMateriaPrima.quantitaResidua);
            if (!validazione.valido) {
                console.error(validazione.messaggio);
                return;
            }

            const nuovaLavorazione = {
                ...preparaNuovaLavorazione(
                    suggerimento.ricetta, 
                    selectedMateriaPrima, 
                    suggerimento.quantitaCalcolata || suggerimento.quantitaConsigliata
                ),
                porzioniPreviste: suggerimento.porzioniSelezionate || suggerimento.porzioniOttenibili,
                grammiPerPorzione: suggerimento.grammiPerPorzioneSelezionati || suggerimento.ricetta.grammiPerPorzione
            };
            
            await addLavorazioneParcheggiata(nuovaLavorazione);
        } catch (error) {
            console.error('Errore conferma suggerimento:', error);
        }
    };

    const handleNuovaRicetta = () => {
        navigate('/ricette/new', { 
            state: { 
                ingredienteBase: selectedMateriaPrima.products[0].name,
                quantitaDisponibile: selectedMateriaPrima.quantitaResidua,
                returnUrl: '/pianificazione'
            }
        });
    };

    const fetchRicetteCompatibili = useCallback(async () => {
        if (!selectedMateriaPrima?.products?.[0]?.name) return;
        
        try {
            const nomeProdotto = selectedMateriaPrima.products[0].name.trim();
            const response = await axios.get(`/api/ricette/per-ingrediente/${encodeURIComponent(nomeProdotto)}`);
            
            const suggerimentiCalcolati = calcolaSuggerimentiRicette(response.data, selectedMateriaPrima);
            const gruppi = raggruppaRicettePerTipo(suggerimentiCalcolati);

            setSuggerimenti(suggerimentiCalcolati);
            setGruppiRicette(gruppi);
        } catch (error) {
            console.error('Errore caricamento suggerimenti:', error);
        }
    }, [selectedMateriaPrima]);

    useEffect(() => {
        fetchRicetteCompatibili();
    }, [fetchRicetteCompatibili]);

    if (!selectedMateriaPrima) {
        return <div className="suggerimenti-section empty">Seleziona una materia prima per vedere i suggerimenti</div>;
    }

    const tracking = getQuantityTracking(selectedMateriaPrima._id);
    const suggerimentiFiltrati = selectedGruppo === 'tutti' 
        ? suggerimenti 
        : suggerimenti.filter(s => s.ricetta.tipo === selectedGruppo);

    return (
        <div className="suggerimenti-section">
            <div className="suggerimenti-header">
                <h3>Suggerimenti per {selectedMateriaPrima.products[0].name}</h3>
                <div className="disponibilita-indicator">
                    <div className="tracking-info">
                        <p>Disponibile: {tracking.disponibile.toFixed(2)} kg</p>
                        <p>Allocato: {tracking.allocata.toFixed(2)} kg</p>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{width: `${(tracking.allocata/tracking.totale)*100}%`}}
                            />
                        </div>
                    </div>
                </div>
                {suggerimenti.length > 0 && (
                    <Select 
                        value={selectedGruppo}
                        onChange={(e) => setSelectedGruppo(e.target.value)}
                        options={[
                            { value: 'tutti', label: 'Tutte le ricette' },
                            ...Object.keys(gruppiRicette).map(gruppo => ({
                                value: gruppo,
                                label: gruppo
                            }))
                        ]}
                    />
                )}
            </div>
            {showLavorazioneLibera && (
    <LavorazioneLibera 
        materiaPrima={selectedMateriaPrima}
        onConfirm={async (lavorazione) => {
            await addLavorazioneParcheggiata(lavorazione);
            setShowLavorazioneLibera(false);
        }}
        onCancel={() => setShowLavorazioneLibera(false)}
    />
)}
            {loadingStates.suggerimenti && <div className="loading">Caricamento suggerimenti...</div>}
            {errors.suggerimenti && <div className="error-message">{errors.suggerimenti}</div>}
            
            <div className="suggerimenti-grid">
                {suggerimentiFiltrati.length > 0 ? (
                    suggerimentiFiltrati.map(sugg => (
                        <SuggerimentoCard
                            key={sugg.ricetta._id}
                            suggerimento={sugg}
                            compatibilityStatus={calcolaCompatibilita(
                                sugg.quantitaCalcolata || sugg.quantitaConsigliata,
                                selectedMateriaPrima.quantitaResidua
                            )}
                            onQuantitaChange={handleQuantitaChange}
                            onConfirm={handleConfermaSuggerimento}
                            showPreview={previewRicettaId === sugg.ricetta._id}
                            loadingStates={loadingStates}
                            validazione={sugg.validazione}
                            compatibilita={sugg.compatibilita}
                            onMouseEnter={() => setPreviewRicettaId(sugg.ricetta._id)}
                            onMouseLeave={() => setPreviewRicettaId(null)}
                        />
                    ))
                ) : (
                    <div className="no-ricette-card">
                        <h4>Nessuna ricetta trovata</h4>
                        <p>Non esistono ricette per {selectedMateriaPrima.products[0].name}</p>
                        
                        <div className="azioni-alternative">
                            <button 
                                className="nuova-ricetta-btn"
                                onClick={handleNuovaRicetta}
                            >
                                Crea Nuova Ricetta
                            </button>
                            
                            <button 
                                className="lavorazione-libera-btn"
                                onClick={() => setShowLavorazioneLibera(true)}
                            >
                                Procedi con Lavorazione Libera
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggerimentiLavorazione;
