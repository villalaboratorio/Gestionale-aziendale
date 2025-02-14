import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/HomePage/Cards.css';

const STATI_LAVORAZIONE = {
    IN_LAVORAZIONE: '673388e5a0e9e0311ca917b2',
    IN_ATTESA: '67434b57174253d7ce494740',
    COMPLETATA: '67434b95174253d7ce494749'
};

const LavorazioniCard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        inLavorazione: 0,
        urgenti: 0,
        inScadenza: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/dettaglio-lavorazioni');
                const lavorazioni = response.data;
                const now = new Date();
                
                const statsData = {
                    inLavorazione: lavorazioni.filter(l => 
                        l.statoLavorazione?._id === STATI_LAVORAZIONE.IN_LAVORAZIONE
                    ).length,
                    urgenti: lavorazioni.filter(l => 
                        l.informazioniGenerali?.isUrgente
                    ).length,
                    inScadenza: lavorazioni.filter(l => {
                        if (!l.informazioniGenerali?.dataConsegnaPrevista) return false;
                        const dataScadenza = new Date(l.informazioniGenerali.dataConsegnaPrevista);
                        const diffGiorni = Math.ceil((dataScadenza - now) / (1000 * 60 * 60 * 24));
                        return diffGiorni <= 3 && diffGiorni > 0;
                    }).length
                };
                
                setStats(statsData);
            } catch (error) {
                console.error('Errore nel recupero delle statistiche:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-card" onClick={() => navigate('/lavorazioni')}>
            <h3>Lavorazioni Attive</h3>
            <div className="card-content">
                <FaExclamationTriangle className="card-icon warning" />
                <div className="stats-content">
                    <p>Lavorazioni in corso: <strong>{stats.inLavorazione}</strong></p>
                    <p>Urgenti: <strong>{stats.urgenti}</strong></p>
                    <p>In scadenza: <strong>{stats.inScadenza}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default LavorazioniCard;
