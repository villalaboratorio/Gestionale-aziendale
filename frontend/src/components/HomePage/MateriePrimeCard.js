import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/HomePage/Cards.css';

const MateriePrimeCard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totali: 0,
        prodotti: []
    });

    useEffect(() => {
        const fetchMateriePrime = async () => {
            try {
                const response = await axios.get('/api/materie-prime');
                const materiePrime = response.data;
                
                const prodottiAttivi = materiePrime.filter(mp => mp.quantitaResidua > 0);

                setStats({
                    totali: prodottiAttivi.length,
                    prodotti: prodottiAttivi.slice(0, 3).map(mp => ({
                        nome: mp.products[0].name,
                        quantita: mp.quantitaResidua
                    }))
                });
            } catch (error) {
                console.error('Errore nel recupero delle materie prime:', error);
            }
        };

        fetchMateriePrime();
    }, []);

    return (
        <div className="stat-card info" onClick={() => navigate('/materie-prime')}>
            <div className="stat-icon">
                <FaBoxOpen />
            </div>
            <div className="stat-details">
                <h3>Materie Prime Disponibili</h3>
                <span className="stat-value">{stats.totali}</span>
                <div className="stat-trend">
                    {stats.prodotti.map((p, i) => (
                        <div key={i}>{p.nome}: {p.quantita} kg</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MateriePrimeCard;
