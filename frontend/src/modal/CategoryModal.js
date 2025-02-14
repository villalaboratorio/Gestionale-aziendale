import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CategoryModal = ({ show, handleClose, fetchCategories }) => {
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const handleInputChange = (e) => {
        setNewCategory({
            ...newCategory,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveCategory = async () => {
        try {
            await axios.post('/api/category-recipes', newCategory);
            fetchCategories(); // Aggiorna le categorie disponibili
            handleClose(); // Chiudi il modale
        } catch (error) {
            console.error("Errore nel salvataggio della categoria:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuova Categoria</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Nome Categoria</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={newCategory.name}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Descrizione Categoria</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={newCategory.description}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Chiudi</Button>
                <Button variant="primary" onClick={handleSaveCategory}>Salva Categoria</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryModal;
