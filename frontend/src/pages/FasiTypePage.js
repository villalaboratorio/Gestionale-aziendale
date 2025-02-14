import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import FasiTypeModal from '../modal/FasiTypeModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FasiTypePage = () => {
    const [fasiTypes, setFasiTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFasiTypes();
    }, []);

    const fetchFasiTypes = async () => {
        try {
            const res = await axios.get('/api/fasi-types');
            setFasiTypes(res.data);
        } catch (error) {
            console.error('Errore nel recupero dei tipi:', error);
        }
    };

    const handleEdit = (type) => {
        setSelectedType(type);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo tipo?')) {
            try {
                await axios.delete(`/api/fasi-types/${id}`);
                fetchFasiTypes();
            } catch (error) {
                console.error('Errore nell\'eliminazione:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedType(null);
    };

    const handleSave = async (typeData) => {
        try {
            if (selectedType) {
                await axios.put(`/api/fasi-types/${selectedType._id}`, typeData);
            } else {
                await axios.post('/api/fasi-types', typeData);
            }
            fetchFasiTypes();
            handleCloseModal();
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
        }
    };

    const filteredTypes = fasiTypes.filter(type => 
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestione Tipi di Fasi</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Nuovo Tipo
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
                    {filteredTypes.map(type => (
                        <tr key={type._id}>
                            <td>{type.name}</td>
                            <td>{type.description}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEdit(type)}
                                    >
                                        <FaEdit /> Modifica
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(type._id)}
                                    >
                                        <FaTrash /> Elimina
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <FasiTypeModal 
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                type={selectedType}
            />
        </Container>
    );
};

export default FasiTypePage;
