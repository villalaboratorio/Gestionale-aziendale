import React, { useState, useEffect } from 'react';
import { Modal as BootstrapModal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';

const StyledModal = styled(BootstrapModal)`
    .modal-dialog {
        margin-left: 260px;
        position: fixed;
        right: 0;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const SearchBarcode = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const SearchResults = styled.div`
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
`;

const SearchResultItem = styled.div`
    padding: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: #f1f5f9;
    }
    border-bottom: 1px solid #e2e8f0;
`;

const NutritionSection = styled.div`
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
`;

const initialState = {
    barcode: '',
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
};

const IngredientModal = ({ show, handleClose, fetchIngredients, availableUnits, ingredient }) => {
    const [newIngredient, setNewIngredient] = useState(initialState);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (show) {
            if (ingredient) {
                setNewIngredient(ingredient);
            } else {
                setNewIngredient(initialState);
            }
        }
    }, [show, ingredient]);

    const handleInputChange = (e) => {
        setNewIngredient({
            ...newIngredient,
            [e.target.name]: e.target.value,
        });
    };

    const handleBarcodeSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/ingredienti/nutrition/${newIngredient.barcode}`);
            if (response.data) {
                setNewIngredient(prev => ({
                    ...prev,
                    nutrition: response.data,
                    name: response.data.productName || prev.name
                }));
            }
        } catch (error) {
            console.error('Errore nel recupero valori nutrizionali:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/ingredienti/search?query=${newIngredient.name}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Errore nella ricerca prodotto:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectProduct = (product) => {
        setNewIngredient(prev => ({
            ...prev,
            name: product.name,
            nutrition: product.nutrition
        }));
        setSearchResults([]);
    };

    const handleNutritionChange = (e) => {
        setNewIngredient({
            ...newIngredient,
            nutrition: {
                ...newIngredient.nutrition,
                [e.target.name]: e.target.value,
            }
        });
    };

    const handleSaveIngredient = async () => {
        setIsLoading(true);
        try {
            if (ingredient) {
                await axios.put(`/api/ingredienti/${ingredient._id}`, newIngredient);
            } else {
                await axios.post('/api/ingredienti', newIngredient);
            }
            await fetchIngredients();
            setNewIngredient(initialState);
            handleClose();
        } catch (error) {
            console.error("Errore nel salvataggio dell'ingrediente:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setNewIngredient(initialState);
        handleClose();
    };

    return (
        <StyledModal show={show} onHide={handleModalClose} size="lg">
            <BootstrapModal.Header closeButton>
                <BootstrapModal.Title>
                    {ingredient ? 'Modifica Ingrediente' : 'Nuovo Ingrediente'}
                </BootstrapModal.Title>
            </BootstrapModal.Header>
            <BootstrapModal.Body>
                <SearchBarcode>
                    <Form.Control
                        type="text"
                        name="barcode"
                        placeholder="Inserisci codice a barre"
                        value={newIngredient.barcode}
                        onChange={handleInputChange}
                    />
                    <Button 
                        $variant="primary"
                        onClick={handleBarcodeSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Ricerca...' : 'Cerca per Barcode'}
                    </Button>
                </SearchBarcode>

                <FormGrid>
                    <Form.Group>
                        <Form.Label>Nome Ingrediente</Form.Label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newIngredient.name}
                                onChange={handleInputChange}
                                required
                            />
                            <Button 
                                $variant="primary"
                                onClick={handleProductSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Ricerca...' : 'Cerca per Nome'}
                            </Button>
                        </div>
                        {searchResults.length > 0 && (
                            <SearchResults>
                                {searchResults.map(product => (
                                    <SearchResultItem 
                                        key={product.id}
                                        onClick={() => handleSelectProduct(product)}
                                    >
                                        {product.name}
                                    </SearchResultItem>
                                ))}
                            </SearchResults>
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Costo</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="cost"
                            value={newIngredient.cost}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Unità di Misura</Form.Label>
                        <Form.Control 
                            as="select"
                            name="unit"
                            value={newIngredient.unit}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleziona Unità</option>
                            {availableUnits?.map(unit => (
                                <option key={unit._id} value={unit._id}>
                                    {unit.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </FormGrid>

                <NutritionSection>
                    <h5>Valori Nutrizionali (per 100g)</h5>
                    <FormGrid>
                        <Form.Group>
                            <Form.Label>Kcal</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="kcal"
                                value={newIngredient.nutrition.kcal}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Grassi</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="fats"
                                value={newIngredient.nutrition.fats}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Grassi Saturi</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="saturatedFats"
                                value={newIngredient.nutrition.saturatedFats}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Carboidrati</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="carbohydrates"
                                value={newIngredient.nutrition.carbohydrates}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Zuccheri</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="sugars"
                                value={newIngredient.nutrition.sugars}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Proteine</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="proteins"
                                value={newIngredient.nutrition.proteins}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Sale</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="salt"
                                value={newIngredient.nutrition.salt}
                                onChange={handleNutritionChange}
                                required
                            />
                        </Form.Group>
                    </FormGrid>
                </NutritionSection>
            </BootstrapModal.Body>
            <BootstrapModal.Footer>
                <Button $variant="secondary" onClick={handleModalClose}>
                    Annulla
                </Button>
                <Button 
                    $variant="primary" 
                    onClick={handleSaveIngredient}
                    disabled={isLoading}
                >
                    {isLoading ? 'Salvataggio...' : (ingredient ? 'Aggiorna' : 'Salva')}
                </Button>
            </BootstrapModal.Footer>
        </StyledModal>
    );
};

export default IngredientModal;
