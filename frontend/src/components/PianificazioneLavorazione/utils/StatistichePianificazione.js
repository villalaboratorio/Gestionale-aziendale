import React from 'react';
import { Card, CardHeader, CardBody } from '../../common/Card/Card';
import './StatistichePianificazione.css';

const StatistichePianificazione = ({ lavorazioni }) => {
    const stats = {
        totali: {
            quantita: lavorazioni.reduce((sum, l) => sum + l.quantitaTotale, 0),
            porzioni: lavorazioni.reduce((sum, l) => sum + l.porzioniPreviste, 0)
        },
        perCliente: lavorazioni.reduce((acc, l) => {
            if (!acc[l.cliente]) acc[l.cliente] = { quantita: 0, porzioni: 0 };
            acc[l.cliente].quantita += l.quantitaTotale;
            acc[l.cliente].porzioni += l.porzioniPreviste;
            return acc;
        }, {})
    };

    return (
        <Card>
            <CardHeader>
                <h4>Riepilogo Sessione Corrente</h4>
            </CardHeader>
            <CardBody>
                <div className="stats-grid">
                    <div className="stats-totali">
                        <h5>Totali</h5>
                        <p>Quantità: {stats.totali.quantita.toFixed(2)} kg</p>
                        <p>Porzioni: {stats.totali.porzioni}</p>
                    </div>
                    <div className="stats-clienti">
                        <h5>Per Cliente</h5>
                        {Object.entries(stats.perCliente).map(([cliente, dati]) => (
                            <div key={cliente} className="cliente-row">
                                <span>{cliente}</span>
                                <span>{dati.quantita.toFixed(2)} kg</span>
                                <span>{dati.porzioni} porz.</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default StatistichePianificazione;
