import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';

const IngredientDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [ingredient, setIngredient] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedIngredient, setUpdatedIngredient] = useState({
        name: '',
        cost: '',
        unit: '',
        nutrition: {
            kcal: '',
            fats: '',
            saturatedFats: '',
            carbohydrates: '',
            sugars: '',
            proteins: '',
            salt: ''
        }
    });

    const fetchIngredient = useCallback(async () => {
        try {
            const res = await axios.get(`/api/ingredienti/${id}`);
            setIngredient(res.data);
            setUpdatedIngredient(res.data);
        } catch (error) {
            console.error('Errore nel recupero dell\'ingrediente:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchIngredient();
    }, [fetchIngredient]);

    const handleDelete = async () => {
        if (window.confirm('Sei sicuro di voler eliminare questo ingrediente?')) {
            try {
                await axios.delete(`/api/ingredienti/${id}`);
                navigate('/ingredients');
            } catch (error) {
                console.error('Errore nell\'eliminazione dell\'ingrediente:', error);
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/ingredienti/${id}`, updatedIngredient);
            setIngredient(updatedIngredient);
            setShowEditModal(false);
        } catch (error) {
            console.error('Errore nell\'aggiornamento dell\'ingrediente:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in updatedIngredient.nutrition) {
            setUpdatedIngredient(prevState => ({
                ...prevState,
                nutrition: {
                    ...prevState.nutrition,
                    [name]: value
                }
            }));
        } else {
            setUpdatedIngredient(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    if (!ingredient) {
        return <div>Caricamento...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Dettaglio Ingrediente</h2>
            <div className="mb-4">
                <h4>Nome: {ingredient.name}</h4>
                <p>Costo: {ingredient.cost}</p>
                <p>Unità: {ingredient.unit ? ingredient.unit.name : 'N/A'}</p>
                <h5>Valori Nutrizionali (per 100g/ml):</h5>
                <ul>
                    <li>Kcal: {ingredient.nutrition.kcal}</li>
                    <li>Grassi: {ingredient.nutrition.fats}g</li>
                    <li>Grassi Saturi: {ingredient.nutrition.saturatedFats}g</li>
                    <li>Carboidrati: {ingredient.nutrition.carbohydrates}g</li>
                    <li>Zuccheri: {ingredient.nutrition.sugars}g</li>
                    <li>Proteine: {ingredient.nutrition.proteins}g</li>
                    <li>Sale: {ingredient.nutrition.salt}g</li>
                </ul>
                <Button variant="warning" onClick={() => setShowEditModal(true)}>
                    Modifica
                </Button>{' '}
                <Button variant="danger" onClick={handleDelete}>
                    Elimina
                </Button>
            </div>

            {/* Modale per la modifica */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Ingrediente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={updatedIngredient.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Costo</Form.Label>
                            <Form.Control
                                type="number"
                                name="cost"
                                value={updatedIngredient.cost}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Unità</Form.Label>
                            <Form.Control
                                as="select"
                                name="unit"
                                value={updatedIngredient.unit._id}
                                onChange={handleChange}
                                required
                            >
                                {/* Aggiungi qui il rendering dinamico delle opzioni di unità */}
                            </Form.Control>
                        </Form.Group>
                        <h5>Valori Nutrizionali (per 100g/ml)</h5>
                        <Form.Group>
                            <Form.Label>Kcal</Form.Label>
                            <Form.Control
                                type="number"
                                name="kcal"
                                value={updatedIngredient.nutrition.kcal}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Grassi</Form.Label>
                            <Form.Control
                                type="number"
                                name="fats"
                                value={updatedIngredient.nutrition.fats}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Grassi Saturi</Form.Label>
                            <Form.Control
                                type="number"
                                name="saturatedFats"
                                value={updatedIngredient.nutrition.saturatedFats}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Carboidrati</Form.Label>
                            <Form.Control
                                type="number"
                                name="carbohydrates"
                                value={updatedIngredient.nutrition.carbohydrates}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Zuccheri</Form.Label>
                            <Form.Control
                                type="number"
                                name="sugars"
                                value={updatedIngredient.nutrition.sugars}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Proteine</Form.Label>
                            <Form.Control
                                type="number"
                                name="proteins"
                                value={updatedIngredient.nutrition.proteins}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sale</Form.Label>
                            <Form.Control
                                type="number"
                                name="salt"
                                value={updatedIngredient.nutrition.salt}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Salva Modifiche
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default IngredientDetail;
