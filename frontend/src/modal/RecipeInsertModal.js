import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import IngredientModal from './IngredientModal';
import CategoryModal from './CategoryModal';
import UnitModal from './UnitModal';

const RecipeInsertModal = ({ show, handleClose }) => {
    const [newRecipe, setNewRecipe] = useState({
        numeroRicetta: '',
        nome: '',
        descrizione: '',
        categoria: '',
        porzioni: 1,
        ingredienti: [],
        fasi: [],
    });

    const [categories, setCategories] = useState([]);  
    const [availableIngredients, setAvailableIngredients] = useState([]);  
    const [availableUnits, setAvailableUnits] = useState([]);  
    const [filteredIngredients, setFilteredIngredients] = useState([]);  
    const [searchTerm, setSearchTerm] = useState('');
    const [newIngredient, setNewIngredient] = useState({
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
    const [newFase, setNewFase] = useState('');

    // Gestione dei modali
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [showUnitModal, setShowUnitModal] = useState(false);

    useEffect(() => {
        fetchCategoriesData();
        fetchIngredientsData();
        fetchUnitsData();
    }, []);

    const fetchCategoriesData = async () => {
        const res = await axios.get('/api/category-recipes');
        setCategories(res.data);
    };

    const fetchIngredientsData = async () => {
        const res = await axios.get('/api/ingredienti');
        setAvailableIngredients(res.data);
    };

    const fetchUnitsData = async () => {
        const res = await axios.get('/api/units');
        setAvailableUnits(res.data);
        console.log('Dati delle unità ricevuti nel genitore:', res.data);  // Verifica cosa arriva dal fetch
    };

    const handleInputChange = (e) => {
        setNewRecipe({
            ...newRecipe,
            [e.target.name]: e.target.value,
        });
    };

    // Gestione della ricerca per autocomplete
    const handleIngredientSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        setFilteredIngredients(
            availableIngredients.filter(ing => 
                (ing.name && ing.name.toLowerCase().includes(searchValue))
            )
        );
    };

    const handleSelectIngredient = (ing) => {
        setNewIngredient({ ...newIngredient, name: ing.name, cost: ing.cost, unit: ing.unit._id });
        setSearchTerm(ing.name);
        setFilteredIngredients([]);
    };

    // Funzione per aggiungere l'ingrediente selezionato nella ricetta
    const addSelectedIngredientToRecipe = () => {
        if (!newIngredient.name || !newIngredient.unit) return;

        setNewRecipe({
            ...newRecipe,
            ingredienti: [...newRecipe.ingredienti, {
                ingrediente: newIngredient.name,
                quantita: newIngredient.quantita || 0,
                unitaMisura: newIngredient.unit,
            }]
        });

        // Reset dell'ingrediente dopo l'aggiunta
        setNewIngredient({
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
    };

    const addFase = () => {
        if (!newFase) return;
        setNewRecipe({
            ...newRecipe,
            fasi: [...newRecipe.fasi, newFase]
        });
        setNewFase('');
    };

    const handleSaveRecipe = async () => {
        try {
            await axios.post('/api/ricette', newRecipe);
            handleClose();
        } catch (error) {
            console.error('Errore nel salvataggio della ricetta:', error);
        }
    };

    return (
        <>
        {/* Modale per aggiungere nuova categoria */}
        <CategoryModal show={showCategoryModal} handleClose={() => setShowCategoryModal(false)} fetchCategories={fetchCategoriesData} />
        
        {/* Modale per aggiungere nuovo ingrediente */}
        <IngredientModal 
            show={showIngredientModal} 
            handleClose={() => setShowIngredientModal(false)} 
            availableUnits={availableUnits}  // Assicuriamoci di passare availableUnits
            fetchIngredients={fetchIngredientsData}
        />
        
        {/* Modale per aggiungere nuova unità */}
        <UnitModal show={showUnitModal} handleClose={() => setShowUnitModal(false)} fetchUnits={fetchUnitsData} />

        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Nuova Ricetta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Campi Ricetta */}
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Numero Ricetta</Form.Label>
                                <Form.Control type="text" name="numeroRicetta" value={newRecipe.numeroRicetta} onChange={handleInputChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nome Ricetta</Form.Label>
                                <Form.Control type="text" name="nome" value={newRecipe.nome} onChange={handleInputChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label>Descrizione</Form.Label>
                        <Form.Control as="textarea" name="descrizione" value={newRecipe.descrizione} onChange={handleInputChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Porzioni</Form.Label>
                        <Form.Control type="number" name="porzioni" value={newRecipe.porzioni} onChange={handleInputChange} min="1" required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control as="select" name="categoria" value={newRecipe.categoria} onChange={handleInputChange}>
                            <option value="">Seleziona Categoria</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Control>
                        <Button variant="link" onClick={() => setShowCategoryModal(true)}>Aggiungi nuova categoria</Button>
                    </Form.Group>

                    {/* Autocomplete per Ingredienti */}
                    <Form.Group>
                        <Form.Label>Ingrediente</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Cerca ingrediente"
                            value={searchTerm}
                            onChange={handleIngredientSearch}
                            required
                        />
                        <ul className="ingredient-list">
                            {filteredIngredients.map(ing => (
                                <li key={ing._id} onClick={() => handleSelectIngredient(ing)}>
                                    {ing.name}
                                </li>
                            ))}
                        </ul>
                        <Button variant="link" onClick={() => setShowIngredientModal(true)}>Aggiungi nuovo ingrediente</Button>
                        <Form.Group as={Row}>
                            <Col md={6}>
                                <Form.Control
                                    type="number"
                                    placeholder="Quantità"
                                    value={newIngredient.quantita}
                                    onChange={e => setNewIngredient({ ...newIngredient, quantita: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Control as="select" value={newIngredient.unit} onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })}>
                                    {availableUnits.map(unit => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Button variant="secondary" onClick={addSelectedIngredientToRecipe}>Aggiungi Ingrediente alla Ricetta</Button>
                    </Form.Group>

                    {/* Tabella degli ingredienti */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Ingrediente</th>
                                <th>Quantità</th>
                                <th>Unità</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newRecipe.ingredienti.map((ing, index) => (
                                <tr key={index}>
                                    <td>{ing.ingrediente}</td>
                                    <td>{ing.quantita}</td>
                                    <td>{ing.unitaMisura}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Fasi */}
                    <Form.Group>
                        <Form.Label>Fasi</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Aggiungi una fase"
                            value={newFase}
                            onChange={e => setNewFase(e.target.value)}
                        />
                        <Button variant="secondary" onClick={addFase}>Aggiungi Fase</Button>
                        <ul>
                            {newRecipe.fasi.map((fase, index) => (
                                <li key={index}>{fase}</li>
                            ))}
                        </ul>
                    </Form.Group>

                    <Button onClick={handleSaveRecipe}>Salva Ricetta</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Chiudi</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default RecipeInsertModal;
