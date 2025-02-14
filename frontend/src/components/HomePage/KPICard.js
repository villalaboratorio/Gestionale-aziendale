import React, { useState, useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import axios from 'axios';

const KPICard = () => {
    const [kpiData, setKpiData] = useState({
        efficienza: 0,
        tempoMedio: 0,
        utilizzoMP: 0
    });

    useEffect(() => {
        const calcolaKPI = async () => {
            try {
                // Calcolo efficienza e tempo medio
                const lavorazioniResponse = await axios.get('/api/dettaglio-lavorazioni');
                const lavorazioni = lavorazioniResponse.data;

                let efficienza = 0;
                let tempoMedio = 0;

                if (lavorazioni && lavorazioni.length > 0) {
                    const lavorazioniCompletate = lavorazioni.filter(l => 
                        l.statoLavorazione?.name === 'Completata' && 
                        l.informazioniGenerali?.dataConsegnaPrevista &&
                        l.dataLavorazione
                    );

                    if (lavorazioniCompletate.length > 0) {
                        const completateInTempo = lavorazioniCompletate.filter(l => {
                            const dataConsegna = new Date(l.informazioniGenerali.dataConsegnaPrevista);
                            const dataCompletamento = new Date(l.updatedAt || l.dataLavorazione);
                            return dataCompletamento <= dataConsegna;
                        });

                        efficienza = Math.round((completateInTempo.length / lavorazioniCompletate.length) * 100);

                        const tempiValidi = lavorazioniCompletate
                            .map(l => {
                                const inizio = new Date(l.dataLavorazione);
                                const fine = new Date(l.updatedAt || l.dataLavorazione);
                                return Math.max(0, (fine - inizio) / (1000 * 60 * 60));
                            })
                            .filter(tempo => !isNaN(tempo) && tempo > 0);

                        if (tempiValidi.length > 0) {
                            tempoMedio = Math.round(tempiValidi.reduce((a, b) => a + b, 0) / tempiValidi.length);
                        }
                    }
                }

                // Calcolo utilizzo materie prime
                const materiePrimeResponse = await axios.get('/api/materie-prime');
                const materiePrime = materiePrimeResponse.data;
                let utilizzoMP = 0;

                if (materiePrime && materiePrime.length > 0) {
                    const utilizziValidi = materiePrime
                        .filter(mp => mp.quantitaIniziale > 0)
                        .map(mp => {
                            const utilizzato = mp.quantitaIniziale - (mp.quantitaResidua || 0);
                            return (utilizzato / mp.quantitaIniziale) * 100;
                        })
                        .filter(perc => !isNaN(perc));

                    if (utilizziValidi.length > 0) {
                        utilizzoMP = Math.round(utilizziValidi.reduce((a, b) => a + b, 0) / utilizziValidi.length);
                    }
                }

                setKpiData({
                    efficienza: efficienza || 0,
                    tempoMedio: tempoMedio || 0,
                    utilizzoMP: utilizzoMP || 0
                });

            } catch (error) {
                console.error('Errore nel calcolo KPI:', error);
                setKpiData({
                    efficienza: 0,
                    tempoMedio: 0,
                    utilizzoMP: 0
                });
            }
        };

        calcolaKPI();
    }, []);

    return (
        <div className="stat-card success">
            <div className="stat-icon">
                <FaChartLine />
            </div>
            <div className="stat-details">
                <h3>Performance</h3>
                <div className="kpi-stats">
                    <div className="kpi-item">
                        <span className="kpi-label">Efficienza</span>
                        <span className="kpi-value">{kpiData.efficienza}%</span>
                    </div>
                    <div className="kpi-item">
                        <span className="kpi-label">Tempo Medio</span>
                        <span className="kpi-value">{kpiData.tempoMedio}h</span>
                    </div>
                    <div className="kpi-item">
                        <span className="kpi-label">Utilizzo MP</span>
                        <span className="kpi-value">{kpiData.utilizzoMP}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPICard;
