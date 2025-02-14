import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import TipoCotturaModal from '../modal/TipoCotturaModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TipoCotturaPage = () => {
    const [tipoCotture, setTipoCotture] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTipoCottura, setSelectedTipoCottura] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTipoCotture();
    }, []);

    const fetchTipoCotture = async () => {
        try {
            const res = await axios.get('/api/tipo-cotture');
            setTipoCotture(res.data);
        } catch (error) {
            console.error('Errore nel recupero dei tipi cottura:', error);
        }
    };

    const handleEdit = (tipoCottura) => {
        setSelectedTipoCottura(tipoCottura);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo tipo cottura?')) {
            try {
                await axios.delete(`/api/tipo-cotture/${id}`);
                fetchTipoCotture();
            } catch (error) {
                console.error('Errore nell\'eliminazione:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTipoCottura(null);
    };

    const handleSave = async (tipoCotturaData) => {
        try {
            if (selectedTipoCottura) {
                await axios.put(`/api/tipo-cotture/${selectedTipoCottura._id}`, tipoCotturaData);
            } else {
                await axios.post('/api/tipo-cotture', tipoCotturaData);
            }
            fetchTipoCotture();
            handleCloseModal();
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
        }
    };

    const filteredTipoCotture = tipoCotture.filter(tipo => 
        tipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tipo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestione Tipi Cottura</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Nuovo Tipo Cottura
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
                    {filteredTipoCotture.map(tipo => (
                        <tr key={tipo._id}>
                            <td>{tipo.name}</td>
                            <td>{tipo.description}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEdit(tipo)}
                                    >
                                        <FaEdit /> Modifica
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(tipo._id)}
                                    >
                                        <FaTrash /> Elimina
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <TipoCotturaModal 
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                tipoCottura={selectedTipoCottura}
            />
        </Container>
    );
};

export default TipoCotturaPage;
