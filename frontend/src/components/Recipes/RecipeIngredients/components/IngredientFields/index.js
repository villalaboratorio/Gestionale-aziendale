import React, { useState, useCallback } from 'react';
import { FaPlus, FaSave } from 'react-icons/fa';
import { Button } from '../../../../../components/common';
import IngredientForm from '../IngredientForm';
import IngredientList from '../IngredientList';
import useIngredientCalculations from '../../hooks/useIngredientCalculations';
import { ingredientiService } from '../../services/apiService';
import { toast } from 'react-toastify';

import {
    Container,
    Header,
    Title,
    Content,
    ErrorMessage,
    LoadingMessage,
    ButtonGroup
} from './styles';

const IngredientFields = React.forwardRef(({ recipeId, isEditing }, ref) => {
    const [showForm, setShowForm] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });
    
    const {
        ingredienti,
        availableIngredients,
        units,
        totals,
        loading,
        error,
        addIngrediente,
        updateIngrediente,
        removeIngrediente,
        updateIngredienti
    } = useIngredientCalculations(recipeId);

    React.useImperativeHandle(ref, () => ({
        saveTempIngredienti: async (newRecipeId) => {
            if (!ingredienti.length) {
                toast.warning('Nessun ingrediente da salvare');
                return;
            }
            
            try {
                const ingredientsData = {
                    ingredienti: ingredienti.map(ing => ({
                        ingrediente: ing.ingrediente._id || ing.ingrediente,
                        quantita: Number(ing.quantita),
                        unitaMisura: ing.unitaMisura._id || ing.unitaMisura,
                        caloPeso: Number(ing.caloPeso) || 0
                    }))
                };

                const result = await ingredientiService.saveTempIngredienti(newRecipeId || recipeId, ingredientsData);
                toast.success('Ingredienti salvati con successo');
                return result;
            } catch (error) {
                toast.error('Errore nel salvataggio degli ingredienti');
                throw error;
            }
        }
    }));

    const handleSaveChanges = useCallback(async () => {
        setSaveStatus({ loading: true, error: null });
        try {
            const ingredientsData = {
                ingredienti: ingredienti.map(ing => ({
                    ingrediente: ing.ingrediente._id || ing.ingrediente,
                    quantita: Number(ing.quantita),
                    unitaMisura: ing.unitaMisura._id || ing.unitaMisura,
                    caloPeso: Number(ing.caloPeso) || 0
                }))
            };
            
            await ingredientiService.saveTempIngredienti(recipeId, ingredientsData);
            const updatedIngredients = await ingredientiService.getRecipeIngredients(recipeId);
            updateIngredienti(updatedIngredients);
            setSaveStatus({ loading: false, error: null });
            toast.success('Modifiche salvate con successo');
        } catch (err) {
            setSaveStatus({ loading: false, error: 'Errore nel salvataggio' });
            toast.error('Errore nel salvataggio delle modifiche');
        }
    }, [ingredienti, recipeId, updateIngredienti]);

    const handleAddIngredient = useCallback(async (data) => {
        try {
            const selectedIngredient = availableIngredients.find(
                i => i._id === data.ingrediente
            );
    
            const selectedUnit = units.find(
                u => u._id === data.unitaMisura
            );
    
            const newIngredient = {
                ingrediente: selectedIngredient._id,
                quantita: Number(data.quantita),
                unitaMisura: selectedUnit._id,
                caloPeso: Number(data.caloPeso) || 0
            };
    
            const result = await addIngrediente(newIngredient);
            
            if (result) {
                setShowForm(false);
                toast.success('Ingrediente aggiunto con successo');
            }
        } catch (err) {
            console.error('Errore nell\'aggiunta ingrediente:', err);
            toast.error('Errore nell\'aggiunta dell\'ingrediente');
        }
    }, [addIngrediente, availableIngredients, units]);

    const handleUpdateIngredient = useCallback(async (index, field, value) => {
        try {
            await updateIngrediente(index, field, value);
            toast.success('Ingrediente aggiornato con successo');
        } catch (err) {
            toast.error('Errore nell\'aggiornamento dell\'ingrediente');
            console.error('Errore nell\'aggiornamento ingrediente:', err);
        }
    }, [updateIngrediente]);

    const handleRemoveIngredient = useCallback(async (index) => {
        try {
            await removeIngrediente(index);
            toast.success('Ingrediente rimosso con successo');
        } catch (err) {
            toast.error('Errore nella rimozione dell\'ingrediente');
            console.error('Errore nella rimozione ingrediente:', err);
        }
    }, [removeIngrediente]);

    if (loading) {
        return <LoadingMessage>Caricamento ingredienti...</LoadingMessage>;
    }

    return (
        <Container>
            <Header>
                <Title>Ingredienti della ricetta</Title>
                <ButtonGroup>
                    {isEditing && !showForm && (
                        <Button 
                            onClick={() => setShowForm(true)}
                            disabled={loading || saveStatus.loading}
                        >
                            <FaPlus /> Aggiungi Ingrediente
                        </Button>
                    )}
                    {isEditing && ingredienti.length > 0 && (
                        <Button 
                            onClick={handleSaveChanges} 
                            primary 
                            disabled={loading || saveStatus.loading}
                        >
                            <FaSave /> {saveStatus.loading ? 'Salvataggio...' : 'Salva Modifiche'}
                        </Button>
                    )}
                </ButtonGroup>
            </Header>

            <Content>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {saveStatus.error && <ErrorMessage>{saveStatus.error}</ErrorMessage>}

                {showForm && (
                    <IngredientForm
                        availableIngredients={availableIngredients}
                        units={units}
                        onSave={handleAddIngredient}
                        onCancel={() => setShowForm(false)}
                        disabled={loading || saveStatus.loading}
                    />
                )}

                <IngredientList
                    ingredients={ingredienti}
                    availableIngredients={availableIngredients}
                    units={units}
                    totals={totals}
                    isEditing={isEditing}
                    onUpdate={handleUpdateIngredient}
                    onRemove={handleRemoveIngredient}
                    disabled={loading || saveStatus.loading}
                />
            </Content>
        </Container>
    );
});

IngredientFields.displayName = 'IngredientFields';

export default IngredientFields;
