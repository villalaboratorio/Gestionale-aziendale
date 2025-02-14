import React, { useState } from 'react';
import { usePianificazione } from './context/PianificazioneContext';
import { Card, CardHeader, CardBody } from '../common/Card/Card';
import Button from '../common/Button/Button';
import Select from '../common/Select/Select';
import EditForm from './components/EditForm';
import LavorazioneCard from './components/LavorazioneCard';
import ConfermaLavorazione from './ConfermaLavorazione';
import './LavorazioniParcheggiate.css';

const LavorazioniParcheggiate = () => {
    const {
        lavorazioniParcheggiate,
        removeLavorazioneParcheggiata,
        updateLavorazioneParcheggiata
    } = usePianificazione();

    const [editing, setEditing] = useState(null);
    const [filtroCliente, setFiltroCliente] = useState('tutti');
    const [ordinamento, setOrdinamento] = useState('data');
    const [showConferma, setShowConferma] = useState(false);

    // Gestione filtri e ordinamento
    const clientiUnici = [...new Set(lavorazioniParcheggiate.map(l => l.cliente))];
    const lavorazioniFiltrate = lavorazioniParcheggiate
        .filter(l => filtroCliente === 'tutti' || l.cliente === filtroCliente)
        .sort((a, b) => {
            if (ordinamento === 'data') return b.dataCreazione - a.dataCreazione;
            if (ordinamento === 'quantita') return b.quantitaTotale - a.quantitaTotale;
            return 0;
        });

    const handleDelete = async (lavorazione) => {
        if (window.confirm('Sei sicuro di voler eliminare questa lavorazione?')) {
            try {
                await removeLavorazioneParcheggiata(lavorazione);
            } catch (error) {
                console.error('Errore eliminazione:', error);
            }
        }
    };

    const handleSave = async (id, updatedData) => {
        try {
            await updateLavorazioneParcheggiata(id, updatedData);
            setEditing(null);
        } catch (error) {
            console.error('Errore aggiornamento:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="header-content">
                    <h3>Lavorazioni in Attesa ({lavorazioniFiltrate.length})</h3>
                    <div className="header-controls">
                        <Select
                            value={filtroCliente}
                            onChange={(e) => setFiltroCliente(e.target.value)}
                            options={[
                                { value: 'tutti', label: 'Tutti i clienti' },
                                ...clientiUnici.map(c => ({ value: c, label: c }))
                            ]}
                        />
                        <Select
                            value={ordinamento}
                            onChange={(e) => setOrdinamento(e.target.value)}
                            options={[
                                { value: 'data', label: 'Data creazione' },
                                { value: 'quantita', label: 'Quantità' }
                            ]}
                        />
                        {lavorazioniFiltrate.length > 0 && (
                            <Button
                                variant="primary"
                                className="avvia-btn"
                                onClick={() => setShowConferma(true)}
                            >
                                Avvia
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardBody>
                {lavorazioniFiltrate.length > 0 ? (
                    <div className="lavorazioni-grid">
                        {lavorazioniFiltrate.map(lavorazione => (
                            editing?.id === lavorazione.id ? (
                                <EditForm
                                    key={lavorazione.id}
                                    lavorazione={lavorazione}
                                    onSave={handleSave}
                                    onCancel={() => setEditing(null)}
                                />
                            ) : (
                                <LavorazioneCard
                                    key={lavorazione.id}
                                    lavorazione={lavorazione}
                                    onEdit={() => setEditing(lavorazione)}
                                    onDelete={handleDelete}
                                />
                            )
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>Nessuna lavorazione in attesa</p>
                    </div>
                )}
            </CardBody>

            {showConferma && (
                <ConfermaLavorazione 
                    onClose={() => setShowConferma(false)}
                    isOpen={showConferma}
                />
            )}
        </Card>
    );
};

export default LavorazioniParcheggiate;
