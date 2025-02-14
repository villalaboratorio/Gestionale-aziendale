import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const ProcessingStatesPage = () => {
    const [states, setStates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Caricamento stati
    const fetchStates = async () => {
        try {
            const response = await axios.get('/api/processing-states');
            setStates(response.data);
        } catch (error) {
            setError('Errore nel caricamento degli stati');
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

    // Gestione form
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setSelectedState(null);
        setError('');
    };

    // Apertura modal per modifica
    const handleEdit = (state) => {
        setSelectedState(state);
        setFormData({ name: state.name, description: state.description || '' });
        setShowModal(true);
    };

    // Salvataggio
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedState) {
                await axios.put(`/api/processing-states/${selectedState._id}`, formData);
                setSuccess('Stato modificato con successo');
            } else {
                await axios.post('/api/processing-states', formData);
                setSuccess('Nuovo stato creato con successo');
            }
            fetchStates();
            setShowModal(false);
            resetForm();
        } catch (error) {
            setError('Errore durante il salvataggio');
        }
    };

    // Eliminazione
    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo stato?')) {
            try {
                await axios.delete(`/api/processing-states/${id}`);
                setSuccess('Stato eliminato con successo');
                fetchStates();
            } catch (error) {
                setError('Errore durante l\'eliminazione');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestione Stati Lavorazione</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                Nuovo Stato
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrizione</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {states.map((state) => (
                        <tr key={state._id}>
                            <td>{state.name}</td>
                            <td>{state.description}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleEdit(state)}
                                >
                                    Modifica
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(state._id)}
                                >
                                    Elimina
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                resetForm();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedState ? 'Modifica Stato' : 'Nuovo Stato'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Salva
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProcessingStatesPage;
