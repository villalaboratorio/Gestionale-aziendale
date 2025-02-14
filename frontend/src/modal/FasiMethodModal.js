import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/Modal.css';

const FasiMethodModal = ({ show, handleClose, handleSave, method }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (method) {
            setFormData({
                name: method.name,
                description: method.description || ''
            });
        } else {
            setFormData({
                name: '',
                description: ''
            });
        }
    }, [method]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave(formData);
    };

    return (
        <div className="modal-wrapper">
            <Modal 
                show={show} 
                onHide={handleClose} 
                className="custom-modal"
                dialogClassName="modal-dialog-centered modal-dialog-scrollable"
                style={{ marginLeft: '250px' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{method ? 'Modifica Metodo' : 'Nuovo Metodo'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Annulla
                        </Button>
                        <Button variant="primary" type="submit">
                            Salva
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default FasiMethodModal;
