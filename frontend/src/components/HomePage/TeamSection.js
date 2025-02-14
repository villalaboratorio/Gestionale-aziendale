import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/HomePage/TeamSection.css';

const TeamSection = () => {
    const [teamAssignments, setTeamAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamAssignments = async () => {
            try {
                const response = await axios.get('/api/dettaglio-lavorazioni');
                const lavorazioniAttive = response.data.filter(
                    lav => lav.statoLavorazione?.name === 'In Lavorazione'
                );

                const assegnazioniAttive = lavorazioniAttive.map(lavorazione => {
                    // Raccogliamo tutti gli addetti coinvolti
                    const addetti = new Set();

                    // Addetti dai passaggi di lavorazione
                    lavorazione.passaggiLavorazione?.forEach(passaggio => {
                        if (passaggio.addetto) addetti.add(passaggio.addetto);
                    });

                    // Addetti dall'assemblaggio
                    if (lavorazione.assemblaggioIngredienti) {
                        Object.values(lavorazione.assemblaggioIngredienti).forEach(fase => {
                            if (fase.addetto) addetti.add(fase.addetto);
                        });
                    }

                    // Addetto abbattimento
                    if (lavorazione.abbattimentoRaffreddamento?.addetto) {
                        addetti.add(lavorazione.abbattimentoRaffreddamento.addetto);
                    }

                    return Array.from(addetti).map(addetto => ({
                        id: `${lavorazione._id}-${addetto}`,
                        nome: addetto,
                        ruolo: 'Operatore',
                        lavorazioneCorrente: `${lavorazione.numeroScheda || 'N/A'} - ${lavorazione.cliente?.nome || 'N/A'}`,
                        stato: 'attivo',
                        oraInizio: lavorazione.dataLavorazione,
                        ricetta: lavorazione.ricetta?.nome || 'N/A'
                    }));
                }).flat();

                setTeamAssignments(assegnazioniAttive);
            } catch (error) {
                console.error('Errore nel recupero assegnazioni:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamAssignments();
        const interval = setInterval(fetchTeamAssignments, 300000); // Aggiorna ogni 5 minuti

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="team-section">Caricamento team in corso...</div>;
    }

    return (
        <div className="team-section">
            <h2>Team al Lavoro</h2>
            <div className="team-grid">
                {teamAssignments.map(membro => (
                    <div key={membro.id} className="team-member-card">
                        <div className="member-avatar">
                            <FaUser className="default-avatar" />
                            <span className={`status-indicator ${membro.stato}`}></span>
                        </div>
                        <div className="member-info">
                            <h3>{membro.nome}</h3>
                            <span className="role">{membro.ruolo}</span>
                            <p className="current-task">
                                <strong>Lavorazione:</strong> {membro.lavorazioneCorrente}
                            </p>
                            <p className="recipe">
                                <strong>Ricetta:</strong> {membro.ricetta}
                            </p>
                            <span className="time-info">
                                Inizio: {new Date(membro.oraInizio).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                {teamAssignments.length === 0 && (
                    <div className="no-assignments">
                        Nessun operatore al lavoro al momento
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamSection;
