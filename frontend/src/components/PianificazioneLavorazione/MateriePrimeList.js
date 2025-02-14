import React, { useEffect, useState } from 'react';
import { usePianificazione } from './context/PianificazioneContext';
import axios from 'axios';
import './MateriePrimeList.css';

const IndicatoreQuantita = ({ materiaPrima }) => {
    const { getQuantityTracking } = usePianificazione();
    const tracking = getQuantityTracking(materiaPrima._id);

    if (!tracking) return null;

    return (
        <div className="indicatore-quantita">
            <div className="quantita-row">
                <span>Quantità Iniziale:</span>
                <strong>{tracking.totale.toFixed(2)} kg</strong>
            </div>
            <div className="quantita-row">
                <span>Allocato:</span>
                <strong>{tracking.allocata.toFixed(2)} kg</strong>
            </div>
            <div className={`quantita-row ${tracking.disponibile <= 0 ? 'warning' : ''}`}>
                <span>Disponibile:</span>
                <strong>{tracking.disponibile.toFixed(2)} kg</strong>
            </div>
        </div>
    );
};

const MateriePrimeList = () => {
    const {
        materiePrimeRecenti,
        setMateriePrimeRecenti,
        selectedMateriaPrima,
        setSelectedMateriaPrima,
        loadingStates,
        setLoadingStates,
        getQuantityTracking
    } = usePianificazione();

    const [filters, setFilters] = useState({
        search: '',
        cliente: '',
        lotto: ''
    });

    const [clienti, setClienti] = useState([]);
    const [lotti, setLotti] = useState([]);

    useEffect(() => {
        const fetchMateriePrime = async () => {
            setLoadingStates(prev => ({ ...prev, materiePrime: true }));
            try {
                const response = await axios.get('http://localhost:5000/api/materie-prime');
                const materiePrimeDaLavorare = response.data.filter(mp => mp.quantitaResidua > 0);
                setMateriePrimeRecenti(materiePrimeDaLavorare);
                
                const uniqueClienti = [...new Set(materiePrimeDaLavorare.map(mp => mp.cliente?.nome))].filter(Boolean);
                const uniqueLotti = [...new Set(materiePrimeDaLavorare.map(mp => mp.products[0]?.lotNumber))].filter(Boolean);
                
                setClienti(uniqueClienti);
                setLotti(uniqueLotti);
            } catch (error) {
                console.error('Errore nel caricamento materie prime:', error);
            }
            setLoadingStates(prev => ({ ...prev, materiePrime: false }));
        };

        fetchMateriePrime();
    }, [setMateriePrimeRecenti, setLoadingStates]);

    const handleSelection = (materiaPrima) => {
        if (!materiaPrima.products?.[0]) return;
        
        const nomeProdotto = materiaPrima.products[0].name.trim();
        setSelectedMateriaPrima({
            ...materiaPrima,
            products: [{
                ...materiaPrima.products[0],
                name: nomeProdotto
            }]
        });
    };

    const getStatoMateriaPrima = (materiaPrimaId) => {
        const tracking = getQuantityTracking(materiaPrimaId);
        if (!tracking) return 'non-disponibile';
        
        const percentuale = (tracking.disponibile / tracking.totale) * 100;
        if (percentuale <= 0) return 'esaurito';
        if (percentuale < 30) return 'scarso';
        return 'disponibile';
    };

    const materiePrimeFiltrate = materiePrimeRecenti.filter(mp => {
        const matchSearch = mp.products[0]?.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchCliente = !filters.cliente || mp.cliente?.nome === filters.cliente;
        const matchLotto = !filters.lotto || mp.products[0]?.lotNumber === filters.lotto;
        return matchSearch && matchCliente && matchLotto;
    });

    if (loadingStates.materiePrime) {
        return <div className="materie-prime-section loading">Caricamento materie prime...</div>;
    }

    return (
        <div className="materie-prime-section">
            <div className="materie-prime-header">
                <h3>Materie Prime da Lavorare</h3>
                <div className="filtri-rapidi">
                    <input
                        type="text"
                        placeholder="Cerca materia prima..."
                        value={filters.search}
                        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                    <select
                        value={filters.cliente}
                        onChange={e => setFilters(prev => ({ ...prev, cliente: e.target.value }))}
                    >
                        <option value="">Tutti i clienti</option>
                        {clienti.map(cliente => (
                            <option key={cliente} value={cliente}>{cliente}</option>
                        ))}
                    </select>
                    <select
                        value={filters.lotto}
                        onChange={e => setFilters(prev => ({ ...prev, lotto: e.target.value }))}
                    >
                        <option value="">Tutti i lotti</option>
                        {lotti.map(lotto => (
                            <option key={lotto} value={lotto}>{lotto}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="materie-prime-grid">
                {materiePrimeFiltrate.length > 0 ? (
                    materiePrimeFiltrate.map(mp => {
                        const stato = getStatoMateriaPrima(mp._id);
                        
                        return (
                            <div
                                key={mp._id}
                                className={`materia-prima-card ${selectedMateriaPrima?._id === mp._id ? 'selected' : ''} stato-${stato}`}
                                onClick={() => handleSelection(mp)}
                            >
                                <div className="mp-header">
                                    <h4>{mp.products[0].name}</h4>
                                    <div className={`stato-indicator ${stato}`} />
                                </div>
                                <IndicatoreQuantita materiaPrima={mp} />
                                <div className="dettagli">
                                    <p>Lotto: {mp.products[0].lotNumber}</p>
                                    <p>Cliente: {mp.cliente?.nome || 'N/D'}</p>
                                    <p>Documento: {mp.documentNumber}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-materie">
                        Nessuna materia prima disponibile
                    </div>
                )}
            </div>
        </div>
    );
};

export default MateriePrimeList;
