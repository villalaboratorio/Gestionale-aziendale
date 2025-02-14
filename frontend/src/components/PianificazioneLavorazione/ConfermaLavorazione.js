import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePianificazione } from './context/PianificazioneContext';
import axios from 'axios';
import './ConfermaLavorazione.css';

const ConfermaLavorazione = ({ onClose = () => {}, isOpen }) => {
    const navigate = useNavigate();
    const {
        lavorazioniParcheggiate,
        clearLavorazioniParcheggiate,
        refreshMateriePrime
    } = usePianificazione();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateLavorazione = (lavorazione) => {
        const requiredFields = [
            'materiaPrima',
            'ricettaId',
            'quantitaTotale',
            'porzioniPreviste',
            'grammiPerPorzione',
            'cliente'
        ];

        return requiredFields.every(field => {
            const value = lavorazione[field];
            return value !== null && value !== undefined && value !== '';
        });
    };

    const mapToDettaglioLavorazione = (lavorazione) => {
        return {
            materiaPrima: lavorazione.materiaPrima.id,
            ricetta: lavorazione.ricettaId,
            quantitaPrevista: lavorazione.quantitaTotale,
            porzioniPreviste: lavorazione.porzioniPreviste,
            grammiPerPorzione: lavorazione.grammiPerPorzione,
            cliente: lavorazione.clienteId, // Use clienteId instead of cliente name
            statoLavorazione: '67434b57174253d7ce494740', // IN_ATTESA
            note: lavorazione.note || '',
            dataLavorazione: new Date().toISOString(),
            informazioniGenerali: {
                descrizione: `Lavorazione pianificata per ${lavorazione.materiaPrima.nome}`,
                dataConsegnaPrevista: new Date().toISOString().split('T')[0],
                prioritaCliente: 'media',
                isUrgente: false
            }
        };
    };
    

    const handleConferma = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Validazione di tutte le lavorazioni
            const isValid = lavorazioniParcheggiate.every(validateLavorazione);
            if (!isValid) {
                throw new Error('Dati incompleti in una o più lavorazioni');
            }

            const lavorazioniPromises = lavorazioniParcheggiate.map(async (lavorazione) => {
                const dettaglioLavorazione = mapToDettaglioLavorazione(lavorazione);
                const responseLavorazione = await axios.post('/api/dettaglio-lavorazioni', dettaglioLavorazione);

                // Aggiornamento materie prime
                await axios.post(`/api/materie-prime/${lavorazione.materiaPrima.id}/prelievo`, {
                    quantitaPrelevata: lavorazione.quantitaTotale,
                    numeroPorzioni: lavorazione.porzioniPreviste,
                    grammiPerPorzione: lavorazione.grammiPerPorzione,
                    lotNumber: lavorazione.materiaPrima.lotNumber,
                    lavorazioneId: responseLavorazione.data._id
                });

                return responseLavorazione.data;
            });

            await Promise.all(lavorazioniPromises);
            await refreshMateriePrime();
            clearLavorazioniParcheggiate();
            onClose();
            navigate('/lavorazioni');

        } catch (error) {
            console.error('Errore conferma lavorazioni:', error);
            setError(error.message || 'Errore durante la conferma delle lavorazioni');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modale-overlay" onClick={e => e.target.className === 'modale-overlay' && onClose()}>
            <div className="modale-conferma">
                <div className="modale-header">
                    <h2>Conferma Lavorazioni</h2>
                    <button className="chiudi-btn" onClick={onClose}>×</button>
                </div>

                <div className="modale-content">
                    <div className="riepilogo-lavorazioni">
                        <h3>Riepilogo ({lavorazioniParcheggiate.length} lavorazioni)</h3>
                        {lavorazioniParcheggiate.map(lav => (
                            <div key={lav.id} className="lavorazione-item">
                                <div className="lavorazione-info">
                                    <span className="nome">{lav.materiaPrima.nome}</span>
                                    <span className="ricetta">{lav.ricettaNome}</span>
                                    <span className="quantita">{lav.quantitaTotale.toFixed(2)} kg</span>
                                    <span className="porzioni">{lav.porzioniPreviste} porzioni</span>
                                    <span className="cliente">{lav.cliente}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                </div>

                <div className="modale-footer">
                    <button 
                        className="annulla-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annulla
                    </button>
                    <button 
                        className="conferma-btn"
                        onClick={handleConferma}
                        disabled={loading}
                    >
                        {loading ? 'Conferma in corso...' : 'Conferma e Avvia'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfermaLavorazione;
