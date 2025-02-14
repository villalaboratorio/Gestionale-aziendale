import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MateriaPrimaModal from '../modal/MateriaPrimaModal';
import '../styles/MateriePrime.css';

const MateriePrime = () => {
    const [materiePrime, setMateriePrime] = useState([]);
    const [filteredMaterie, setFilteredMaterie] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMateria, setSelectedMateria] = useState(null);
    const [statusFilter, setStatusFilter] = useState('attiva'); // Stato attivo o esaurito

    useEffect(() => {
        fetchMateriePrime();
    }, []);

    const fetchMateriePrime = async () => {
        try {
            const response = await axios.get('/api/materie-prime');
            setMateriePrime(response.data);
            setFilteredMaterie(response.data);
        } catch (error) {
            console.error("Errore nel caricamento delle materie prime:", error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = materiePrime.filter((materia) => {
            return (
                materia.documentNumber.includes(e.target.value) ||
                materia.cliente?.nome.includes(e.target.value) ||
                materia.products.some((product) =>
                    product.name.toLowerCase().includes(e.target.value.toLowerCase())
                )
            );
        });
        setFilteredMaterie(filtered);
    };

    const handleFilterStatus = (status) => {
        setStatusFilter(status);
        const filtered = materiePrime.filter((materia) => {
            return (status === 'attiva' && materia.quantitaResidua > 0) ||
                   (status === 'esaurita' && materia.quantitaResidua === 0);
        });
        setFilteredMaterie(filtered);
    };

    const openModal = (materia = null) => {
        setSelectedMateria(materia);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedMateria(null);
        setShowModal(false);
    };

    const handleSaveMateriaPrima = (newMateriaPrima) => {
        // Aggiornamento o salvataggio delle materie prime
        fetchMateriePrime();
        closeModal();
    };

    const handleDeleteMateriaPrima = async (id) => {
        try {
            await axios.delete(`/api/materie-prime/${id}`);
            fetchMateriePrime();
        } catch (error) {
            console.error("Errore durante l'eliminazione della materia prima:", error);
        }
    };

    return (
        <div className="materie-prime-container">
            <h1>Gestione Materie Prime</h1>

            {/* Barra di Ricerca e Filtro per Stato */}
            <div className="materie-prime-filters">
                <input
                    type="text"
                    placeholder="Cerca per documento, cliente, prodotto..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select onChange={(e) => handleFilterStatus(e.target.value)} value={statusFilter}>
                    <option value="attiva">Materie Prime Attive</option>
                    <option value="esaurita">Materie Prime Esaurite</option>
                </select>
                <button onClick={() => openModal()}>Aggiungi Materia Prima</button>
            </div>

            {/* Pannelli per le Materie Prime Attive/Esaurite */}
            <div className="materie-prime-panels">
                <div className="panel">
                    <h2>Materie Prime {statusFilter === 'attiva' ? "Attive" : "Esaurite"}</h2>
                    <table className="materie-table">
                        <thead>
                            <tr>
                                <th>Numero Documento</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Prodotti</th>
                                <th>Quantità Residua</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterie.map((materia) => (
                                <tr key={materia._id}>
                                    <td>{materia.documentNumber}</td>
                                    <td>{new Date(materia.date).toLocaleDateString()}</td>
                                    <td>{materia.cliente?.nome}</td>
                                    <td>
                                        {materia.products.map((product, idx) => (
                                            <div key={idx}>{product.name} ({product.quantity} kg)</div>
                                        ))}
                                    </td>
                                    <td>{materia.quantitaResidua} kg</td>
                                    <td>
                                        <button onClick={() => openModal(materia)}>Modifica</button>
                                        <button onClick={() => handleDeleteMateriaPrima(materia._id)}>Elimina</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modale per l'Aggiunta e la Modifica delle Materie Prime */}
            {showModal && (
                <MateriaPrimaModal
                    isOpen={showModal}
                    onClose={closeModal}
                    onSave={handleSaveMateriaPrima}
                    selectedMateria={selectedMateria}
                />
            )}
        </div>
    );
};

export default MateriePrime;
