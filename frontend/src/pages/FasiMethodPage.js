import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import FasiMethodModal from '../modal/FasiMethodModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FasiMethodPage = () => {
    const [fasiMethods, setFasiMethods] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFasiMethods();
    }, []);

    const fetchFasiMethods = async () => {
        try {
            const res = await axios.get('/api/fasi-methods');
            setFasiMethods(res.data);
        } catch (error) {
            console.error('Errore nel recupero dei metodi:', error);
        }
    };

    const handleEdit = (method) => {
        setSelectedMethod(method);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo metodo?')) {
            try {
                await axios.delete(`/api/fasi-methods/${id}`);
                fetchFasiMethods();
            } catch (error) {
                console.error('Errore nell\'eliminazione:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMethod(null);
    };

    const handleSave = async (methodData) => {
        try {
            if (selectedMethod) {
                await axios.put(`/api/fasi-methods/${selectedMethod._id}`, methodData);
            } else {
                await axios.post('/api/fasi-methods', methodData);
            }
            fetchFasiMethods();
            handleCloseModal();
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
        }
    };

    const filteredMethods = fasiMethods.filter(method => 
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestione Metodi di Fasi</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Nuovo Metodo
                </Button>
            </div>

            <Form.Control
                type="text"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 w-25"
            />

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrizione</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMethods.map(method => (
                        <tr key={method._id}>
                            <td>{method.name}</td>
                            <td>{method.description}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEdit(method)}
                                    >
                                        <FaEdit /> Modifica
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(method._id)}
                                    >
                                        <FaTrash /> Elimina
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <FasiMethodModal 
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                method={selectedMethod}
            />
        </Container>
    );
};

export default FasiMethodPage;
