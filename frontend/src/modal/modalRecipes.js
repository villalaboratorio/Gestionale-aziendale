import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import CategoryModal from './CategoryModal';
import UnitModal from './UnitModal';
import IngredientModal from './IngredientModal';

const ModalRecipe = ({ 
    showRecipeModal, 
    handleCloseRecipe,
    onSave,
    initialData
}) => {
    const [showModals, setShowModals] = useState({
        category: false,
        unit: false,
        ingredient: false
    });

    const [formData, setFormData] = useState({
        numeroRicetta: '',
        nome: '',
        descrizione: '',
        categoria: '',
        porzioni: 1,
        ingredienti: [],
        fasi: []
    });

    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState({
        ingrediente: '',
        quantita: 0,
        unitaMisura: ''
    });

    useEffect(() => {
        if (showRecipeModal) {
            fetchCategories();
            fetchUnits();
            fetchIngredients();
            if (initialData) {
                setFormData(initialData);
            }
        }
    }, [showRecipeModal, initialData]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/category-recipes');
            setCategories(response.data);
        } catch (error) {
            console.error('Errore nel recupero delle categorie:', error);
        }
    };

    const fetchUnits = async () => {
        try {
            const response = await axios.get('/api/units');
            setUnits(response.data);
        } catch (error) {
            console.error('Errore nel recupero delle unità:', error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await axios.get('/api/ingredienti');
            setIngredients(response.data);
        } catch (error) {
            console.error('Errore nel recupero degli ingredienti:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIngredientChange = (e) => {
        const { name, value } = e.target;
        setCurrentIngredient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addIngredient = () => {
        if (currentIngredient.ingrediente && currentIngredient.quantita && currentIngredient.unitaMisura) {
            setFormData(prev => ({
                ...prev,
                ingredienti: [...prev.ingredienti, currentIngredient]
            }));
            setCurrentIngredient({
                ingrediente: '',
                quantita: 0,
                unitaMisura: ''
            });
        }
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredienti: prev.ingredienti.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleCloseModal = (modalType) => {
        setShowModals(prev => ({
            ...prev,
            [modalType]: false
        }));
    };

    return (
        <>
            <Modal show={showRecipeModal} onHide={handleCloseRecipe} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {initialData ? 'Modifica Ricetta' : 'Nuova Ricetta'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Numero Ricetta</Form.Label>
                            <Form.Control
                                type="text"
                                name="numeroRicetta"
                                value={formData.numeroRicetta}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <div className="d-flex">
                                <Form.Select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Seleziona categoria</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Button 
                                    variant="outline-primary" 
                                    className="ms-2"
                                    onClick={() => setShowModals(prev => ({ ...prev, category: true }))}
                                >
                                    +
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Porzioni</Form.Label>
                            <Form.Control
                                type="number"
                                name="porzioni"
                                value={formData.porzioni}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descrizione"
                                value={formData.descrizione}
                                onChange={handleInputChange}
                                rows={3}
                            />
                        </Form.Group>

                        <div className="ingredients-section mb-3">
                            <h5>Ingredienti</h5>
                            {formData.ingredienti.map((ing, index) => (
                                <div key={index} className="ingredient-item d-flex align-items-center mb-2">
                                    <span>{ingredients.find(i => i._id === ing.ingrediente)?.nome}</span>
                                    <span className="mx-2">{ing.quantita}</span>
                                    <span>{units.find(u => u._id === ing.unitaMisura)?.nome}</span>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        className="ms-2"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}

                            <div className="add-ingredient d-flex gap-2 mt-2">
                                <Form.Select
                                    name="ingrediente"
                                    value={currentIngredient.ingrediente}
                                    onChange={handleIngredientChange}
                                >
                                    <option value="">Seleziona ingrediente</option>
                                    {ingredients.map(ing => (
                                        <option key={ing._id} value={ing._id}>
                                            {ing.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control
                                    type="number"
                                    name="quantita"
                                    value={currentIngredient.quantita}
                                    onChange={handleIngredientChange}
                                    placeholder="Quantità"
                                    style={{ width: '100px' }}
                                />
                                <Form.Select
                                    name="unitaMisura"
                                    value={currentIngredient.unitaMisura}
                                    onChange={handleIngredientChange}
                                >
                                    <option value="">Unità</option>
                                    {units.map(unit => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Button onClick={addIngredient}>
                                    Aggiungi
                                </Button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleCloseRecipe}>
                                Annulla
                            </Button>
                            <Button variant="primary" type="submit">
                                Salva
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <CategoryModal 
                show={showModals.category} 
                handleClose={() => handleCloseModal('category')}
                onSave={fetchCategories}
            />
            <UnitModal 
                show={showModals.unit} 
                handleClose={() => handleCloseModal('unit')}
                onSave={fetchUnits}
            />
            <IngredientModal 
                show={showModals.ingredient} 
                handleClose={() => handleCloseModal('ingredient')}
                onSave={fetchIngredients}
            />
        </>
    );
};

export default ModalRecipe;
