import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../styles/Modal.css';

const FasiTypeModal = ({ show, handleClose, handleSave, type }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (type) {
            setFormData({
                name: type.name,
                description: type.description || ''
            });
        } else {
            setFormData({
                name: '',
                description: ''
            });
        }
    }, [type]);

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
                    <Modal.Title>{type ? 'Modifica Tipo' : 'Nuovo Tipo'}</Modal.Title>
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

export default FasiTypeModal;
