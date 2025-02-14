import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ClientiPage.css';

const ClientiPage = () => {
    const navigate = useNavigate();
    const [clienti, setClienti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');  // Stato per la barra di ricerca
    const [newCliente, setNewCliente] = useState({
        nome: '',
        indirizzo: { via: '', citta: '' },
        contatti: { telefono: '', email: '' },
        partitaIva: '',
        metodoPagamento: 'bonifico bancario'
    });

    useEffect(() => {
        const fetchClienti = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clienti');
                setClienti(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Errore nel caricamento dei clienti:', error);
                setLoading(false);
            }
        };

        fetchClienti();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCliente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewCliente(prevState => ({
            ...prevState,
            indirizzo: {
                ...prevState.indirizzo,
                [name]: value
            }
        }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setNewCliente(prevState => ({
            ...prevState,
            contatti: {
                ...prevState.contatti,
                [name]: value
            }
        }));
    };

    const addCliente = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/clienti', newCliente);
            setClienti([...clienti, response.data]);
            setNewCliente({
                nome: '',
                indirizzo: { via: '', citta: '' },
                contatti: { telefono: '', email: '' },
                partitaIva: '',
                metodoPagamento: 'bonifico bancario'
            });
        } catch (error) {
            if (error.response && error.response.data.message === 'Email già in uso') {
                alert('Email già in uso. Per favore, usa un\'altra email.');
            } else {
                console.error('Errore nell\'aggiunta del cliente:', error.response ? error.response.data : error.message);
            }
        }
    };

    const navigateToCliente = (id) => {
        navigate(`/clienti/${id}`);
    };

    const filteredClienti = clienti.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cliente.contatti.email && cliente.contatti.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div>Caricamento in corso...</div>;
    }

    return (
        <div className="clienti-page">
            <h1>Gestione Clienti</h1>
            <input
                type="text"
                id="search-bar"
                name="search-bar"
                placeholder="Cerca per nome o email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
                autocomplete="off"
            />
            <div className="form-container">
                <h2>Aggiungi un nuovo cliente</h2>
                <form onSubmit={(e) => { e.preventDefault(); addCliente(); }}>
                    <input 
                        type="text" 
                        id="nome" 
                        name="nome" 
                        placeholder="Nome" 
                        value={newCliente.nome} 
                        onChange={handleInputChange} 
                        required 
                        autocomplete="name"
                    />
                    <input 
                        type="text" 
                        id="via" 
                        name="via" 
                        placeholder="Via" 
                        value={newCliente.indirizzo.via} 
                        onChange={handleAddressChange} 
                        required 
                        autocomplete="address-line1"
                    />
                    <input 
                        type="text" 
                        id="citta" 
                        name="citta" 
                        placeholder="Città" 
                        value={newCliente.indirizzo.citta} 
                        onChange={handleAddressChange} 
                        required 
                        autocomplete="address-level2"
                    />
                    <input 
                        type="text" 
                        id="telefono" 
                        name="telefono" 
                        placeholder="Telefono" 
                        value={newCliente.contatti.telefono} 
                        onChange={handleContactChange} 
                        required 
                        autocomplete="tel"
                    />
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Email" 
                        value={newCliente.contatti.email} 
                        onChange={handleContactChange} 
                        autocomplete="email"
                    />
                    <input 
                        type="text" 
                        id="partitaIva" 
                        name="partitaIva" 
                        placeholder="Partita IVA" 
                        value={newCliente.partitaIva} 
                        onChange={handleInputChange} 
                        autocomplete="off"
                    />
                    
                    <select 
                        id="metodoPagamento" 
                        name="metodoPagamento" 
                        value={newCliente.metodoPagamento} 
                        onChange={handleInputChange} 
                        required 
                        autocomplete="off"
                    >
                        <option value="bonifico bancario">Bonifico Bancario</option>
                        <option value="carta di credito">Carta di Credito</option>
                        <option value="paypal">PayPal</option>
                    </select>
                    
                    <button type="submit">Aggiungi Cliente</button>
                </form>
            </div>

            <table className="clienti-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Indirizzo</th>
                        <th>Contatti</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClienti.map(cliente => (
                        <tr key={cliente._id} onClick={() => navigateToCliente(cliente._id)}>
                            <td>{cliente.nome}</td>
                            <td>{cliente.indirizzo.via}, {cliente.indirizzo.citta}</td>
                            <td>
                                Telefono: {cliente.contatti?.telefono || 'N/A'}<br />
                                Email: {cliente.contatti?.email || 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientiPage;
