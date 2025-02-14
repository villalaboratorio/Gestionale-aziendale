import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SchedaCliente.css';

const SchedaCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                console.log(`Fetching cliente with ID: ${id}`);
                const response = await axios.get(`http://localhost:5000/api/clienti/${id}`);
                setCliente(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Errore nel caricamento del cliente:', error);
                console.error('Errore dettagliato:', error.response?.data || error.message);
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const [parentKey, childKey] = name.split('.');

        if (childKey) {
            setCliente(prevState => ({
                ...prevState,
                [parentKey]: {
                    ...prevState[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            setCliente(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const updateCliente = async () => {
        try {
            await axios.put(`http://localhost:5000/api/clienti/${id}`, cliente);
            alert('Cliente aggiornato con successo');
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del cliente:', error);
        }
    };

    const deleteCliente = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/clienti/${id}`);
            alert('Cliente eliminato con successo');
            navigate('/clienti');  // Reindirizza alla pagina principale dopo l'eliminazione
        } catch (error) {
            console.error('Errore durante l\'eliminazione del cliente:', error);
        }
    };

    if (loading) {
        return <div>Caricamento in corso...</div>;
    }

    return (
        <div className="scheda-cliente">
            <h1>Dettaglio Cliente</h1>
            {cliente && (
                <div>
                    <div>
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={cliente.nome}
                            onChange={handleInputChange}
                            autoComplete="name"
                        />
                    </div>
                    <div>
                        <label>Indirizzo:</label>
                        <input
                            type="text"
                            name="indirizzo.via"
                            value={cliente.indirizzo.via}
                            onChange={handleInputChange}
                            autoComplete="address-line1"
                        />
                        <input
                            type="text"
                            name="indirizzo.citta"
                            value={cliente.indirizzo.citta}
                            onChange={handleInputChange}
                            autoComplete="address-level2"
                        />
                    </div>
                    <div>
                        <label>Telefono:</label>
                        <input
                            type="text"
                            name="contatti.telefono"
                            value={cliente.contatti.telefono}
                            onChange={handleInputChange}
                            autoComplete="tel"
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            name="contatti.email"
                            value={cliente.contatti.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                        />
                    </div>
                    <button onClick={updateCliente}>Aggiorna Cliente</button>
                    <button onClick={deleteCliente}>Elimina Cliente</button>
                </div>
            )}
        </div>
    );
};

export default SchedaCliente;
