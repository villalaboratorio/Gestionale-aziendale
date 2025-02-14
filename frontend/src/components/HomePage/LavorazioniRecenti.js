import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/HomePage/LavorazioniRecenti.css';

const LavorazioniRecenti = () => {
    const [lavorazioni, setLavorazioni] = useState([]);

    const calcolaProgresso = (lavorazione) => {
        if (!lavorazione) return 0;
        
        let totaleFasi = 0;
        let fasiCompletate = 0;

        // InformazioniGenerali
        if (lavorazione.informazioniGenerali) {
            totaleFasi++;
            const valoriCompilati = Object.values(lavorazione.informazioniGenerali)
                .filter(val => val !== null && val !== undefined && val !== '');
            if (valoriCompilati.length > 0) fasiCompletate++;
        }

        // PassaggiLavorazione
        if (Array.isArray(lavorazione.passaggiLavorazione) && lavorazione.passaggiLavorazione.length > 0) {
            totaleFasi += lavorazione.passaggiLavorazione.length;
            fasiCompletate += lavorazione.passaggiLavorazione
                .filter(p => p && p.fine && new Date(p.fine) <= new Date())
                .length;
        }

        // AssemblaggioIngredienti
        if (lavorazione.assemblaggioIngredienti) {
            const fasi = ['crudo', 'dopoCotturaParziale', 'dopoCotturaCompleta', 'crudoSegueCottura'];
            fasi.forEach(fase => {
                const faseLavorazione = lavorazione.assemblaggioIngredienti[fase];
                if (faseLavorazione) {
                    totaleFasi++;
                    if (faseLavorazione.ore && faseLavorazione.addetto) {
                        fasiCompletate++;
                    }
                }
            });
        }

        // AbbattimentoRaffreddamento
        if (lavorazione.abbattimentoRaffreddamento) {
            totaleFasi++;
            if (lavorazione.abbattimentoRaffreddamento.fine) {
                fasiCompletate++;
            }
        }

        // Conservazione
        if (lavorazione.conservazione) {
            totaleFasi++;
            if (lavorazione.conservazione.fine) {
                fasiCompletate++;
            }
        }

        return totaleFasi > 0 ? Math.round((fasiCompletate / totaleFasi) * 100) : 0;
    };

    useEffect(() => {
        const fetchLavorazioniRecenti = async () => {
            try {
                const response = await axios.get('/api/dettaglio-lavorazioni', {
                    params: {
                        status: 'active',
                        limit: 4,
                        sort: '-dataLavorazione'
                    }
                });

                const lavorazioniRecenti = response.data.map(lav => ({
                    id: lav._id,
                    nome: lav.numeroScheda || 'Nuova Lavorazione',
                    cliente: lav.cliente?.nome || 'Cliente non assegnato',
                    stato: lav.statoLavorazione?.name?.toLowerCase() || 'in-corso',
                    completamento: calcolaProgresso(lav) || 0,
                    ricetta: lav.ricetta?.nome || 'Ricetta non assegnata',
                    dataInizio: lav.dataLavorazione ? 
                        new Date(lav.dataLavorazione).toLocaleDateString() : 
                        new Date().toLocaleDateString(),
                    isUrgente: lav.informazioniGenerali?.isUrgente || false
                }));
                
                setLavorazioni(lavorazioniRecenti);
            } catch (error) {
                console.error('Errore nel recupero lavorazioni recenti:', error);
                setLavorazioni([]);
            }
        };

        fetchLavorazioniRecenti();
    }, []);

    return (
        <div className="recent-works">
            <h2>Lavorazioni Recenti</h2>
            <div className="works-list">
                {lavorazioni.length > 0 ? (
                    lavorazioni.map(lavorazione => (
                        <Link 
                            to={`/dettaglio-lavorazioni/${lavorazione.id}`} 
                            key={lavorazione.id} 
                            className="work-card-link"
                        >
                            <div className={`work-card ${lavorazione.stato} ${lavorazione.isUrgente ? 'urgente' : ''}`}>
                                <div className="work-header">
                                    <h3>{lavorazione.nome}</h3>
                                    <span className="work-client">{lavorazione.cliente}</span>
                                </div>
                                <div className="work-details">
                                    <p className="recipe">Ricetta: {lavorazione.ricetta}</p>
                                    <p className="start-date">Data: {lavorazione.dataInizio}</p>
                                </div>
                                <div className="progress-bar" title={`${lavorazione.completamento}% completato`}>
                                    <div
                                        className="progress"
                                        style={{width: `${lavorazione.completamento}%`}}
                                    />
                                </div>
                                <div className="work-footer">
                                    <span className="completion">{lavorazione.completamento}%</span>
                                    <span className={`status ${lavorazione.stato}`}>
                                        {lavorazione.stato.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-lavorazioni">
                        <p>Nessuna lavorazione recente</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LavorazioniRecenti;
