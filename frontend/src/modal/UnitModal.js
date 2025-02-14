import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';
import { UNIT_TYPES, UNIT_CONVERSIONS } from '../components/Recipes/RecipeGeneralInfo/utils/conversions';

const StyledModal = styled(Modal)`
    .modal-dialog {
        display: flex;
        align-items: center;
        min-height: calc(100vh - 60px);
        margin: 30px auto;
    }
    
    .modal-content {
        width: 100%;
        max-width: 500px;
        margin: auto;
    }
`;

const FormGroup = styled(Form.Group)`
    margin-bottom: 1rem;
`;

const ErrorAlert = styled(Alert)`
    margin-bottom: 1rem;
`;

const UnitModal = ({ show, handleClose, fetchUnits, unit }) => {
    const [formData, setFormData] = useState({
        name: '',
        abbreviation: '',
        type: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                abbreviation: formData.abbreviation.toLowerCase(),
                type: formData.type
            };

            if (unit) {
                await axios.put(`/api/units/${unit._id}`, payload);
            } else {
                await axios.post('/api/units', payload);
            }
            fetchUnits();
            handleClose();
            setFormData({ name: '', abbreviation: '', type: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Errore nel salvataggio');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledModal 
            show={show} 
            onHide={handleClose}
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>{unit ? 'Modifica Unità' : 'Nuova Unità'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <ErrorAlert variant="danger">{error}</ErrorAlert>}
                
                <Form>
                    <FormGroup>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Abbreviazione</Form.Label>
                        <Form.Control
                            type="text"
                            name="abbreviation"
                            value={formData.abbreviation}
                            onChange={handleInputChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Abbreviazioni valide: {Object.keys(UNIT_CONVERSIONS).join(', ')}
                        </Form.Text>
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleziona tipo</option>
                            {Object.keys(UNIT_TYPES).map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Form.Select>
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annulla
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Salvataggio...' : (unit ? 'Aggiorna' : 'Salva')}
                </Button>
            </Modal.Footer>
        </StyledModal>
    );
};

export default UnitModal;
