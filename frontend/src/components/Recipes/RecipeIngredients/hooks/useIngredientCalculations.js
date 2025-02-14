import { useCallback, useEffect } from 'react';
import { ingredientiService } from '../services/apiService';
import { CostCalculator, WeightCalculator } from '../services/calculations';
import { validationService } from '../services/validationService';
import { useIngredientState } from './state/ingredientState';
import { toast } from 'react-toastify';

const useIngredientCalculations = (recipeId) => {
    const {
        state,
        setInitialData,
        updateIngredienti,
        updateCalculations,
        setLoading,
        setError
    } = useIngredientState();

    const calculateTotals = useCallback((ingredients, availableIngredients) => {
        try {
            // Log per debug
            console.log('Ingredienti ricevuti:', ingredients);
            console.log('Ingredienti disponibili:', availableIngredients);
    
            if (!ingredients?.length || !availableIngredients?.length) {
                return {
                    rawCost: 0,
                    weightLoss: 0,
                    finalCost: 0,
                    totalWeightLoss: 0
                };
            }
    
            // Prepara gli ingredienti con i dati completi
            const preparedIngredients = ingredients.map(ing => {
                const fullIngredient = availableIngredients.find(ai => ai._id === ing.ingrediente);
                return {
                    ...ing,
                    ingrediente: fullIngredient,
                    cost: fullIngredient?.cost || 0
                };
            });
    
            console.log('Ingredienti preparati:', preparedIngredients);
    
            const totals = {
                ...CostCalculator.calculateIngredientTotals(preparedIngredients, availableIngredients),
                totalWeightLoss: WeightCalculator.calculateTotalYield(preparedIngredients)
            };
    
            console.log('Totali calcolati:', totals);
            return totals;
    
        } catch (error) {
            console.error('Errore dettagliato:', error);
            setError(`Errore nel calcolo dei totali: ${error.message}`);
            return null;
        }
    }, [setError]);
    

    useEffect(() => {
        let isSubscribed = true;

        const loadData = async () => {
            try {
                setLoading(true);
                const [ingredientsRes, unitsRes] = await Promise.all([
                    ingredientiService.getAllIngredients(),
                    ingredientiService.getUnits()
                ]);

                if (!isSubscribed) return;

                if (recipeId === 'new') {
                    setInitialData([], ingredientsRes, unitsRes);
                    return;
                }

                if (recipeId) {
                    const recipeIngredientsRes = await ingredientiService.getRecipeIngredients(recipeId);
                    if (!isSubscribed) return;

                    setInitialData(recipeIngredientsRes, ingredientsRes, unitsRes);
                    const totals = calculateTotals(recipeIngredientsRes, ingredientsRes);
                    if (totals) {
                        updateCalculations(totals);
                    }
                }
            } catch (err) {
                if (!isSubscribed) return;
                setError('Errore nel caricamento dei dati');
                toast.error('Errore nel caricamento dei dati');
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        };

        loadData();
        return () => { isSubscribed = false; };
    }, [recipeId, setError, setInitialData, updateCalculations, calculateTotals, setLoading]);

    const addIngrediente = useCallback(async (ingredientData) => {
        try {
            const selectedIngredient = state.data.availableIngredients.find(
                i => i._id === ingredientData.ingrediente
            );
    
            const selectedUnit = state.data.units.find(
                u => u._id === ingredientData.unitaMisura
            );
    
            if (!selectedIngredient || !selectedUnit) {
                throw new Error('Ingrediente o unità di misura non trovati');
            }
    
            const newIngredient = {
                ingrediente: selectedIngredient._id,
                quantita: Number(ingredientData.quantita),
                unitaMisura: selectedUnit._id,
                caloPeso: Number(ingredientData.caloPeso) || 0
            };
    
            const newIngredienti = [...state.data.ingredienti, newIngredient];
    
            // Per nuove ricette, aggiorna solo lo stato locale
            if (recipeId === 'new') {
                updateIngredienti(newIngredienti);
                const totals = calculateTotals(newIngredienti, state.data.availableIngredients);
                updateCalculations(totals);
                toast.success('Ingrediente aggiunto con successo');
                return newIngredient;
            }
    
            // Per ricette esistenti, salva sul server
            const payloadData = {
                ingredienti: newIngredienti.map(ing => ({
                    ingrediente: ing.ingrediente,
                    quantita: Number(ing.quantita),
                    unitaMisura: ing.unitaMisura,
                    caloPeso: Number(ing.caloPeso)
                }))
            };
    
            await ingredientiService.saveTempIngredienti(recipeId, payloadData);
            updateIngredienti(newIngredienti);
            const totals = calculateTotals(newIngredienti, state.data.availableIngredients);
            updateCalculations(totals);
            toast.success('Ingrediente aggiunto con successo');
    
            return newIngredient;
        } catch (err) {
            const errorMessage = err.message || 'Errore nell\'aggiunta dell\'ingrediente';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        }
    }, [recipeId, state.data, updateIngredienti, calculateTotals, updateCalculations, setError]);
    

    const updateIngrediente = useCallback(async (index, field, value) => {
        const updatedIngredient = {
            ...state.data.ingredienti[index],
            [field]: value
        };

        const validation = validationService.validateIngredient(updatedIngredient);
        if (!validation.isValid) {
            Object.values(validation.errors).forEach(error => toast.error(error));
            setError(Object.values(validation.errors)[0]);
            return;
        }

        try {
            const updatedIngredienti = [...state.data.ingredienti];
            updatedIngredienti[index] = updatedIngredient;

            if (recipeId !== 'new') {
                const payloadData = {
                    ingredienti: updatedIngredienti.map(ing => ({
                        ingrediente: ing.ingrediente._id || ing.ingrediente,
                        quantita: ing.quantita,
                        unitaMisura: ing.unitaMisura._id || ing.unitaMisura,
                        caloPeso: ing.caloPeso
                    }))
                };
                await ingredientiService.saveTempIngredienti(recipeId, payloadData);
            }

            updateIngredienti(updatedIngredienti);
            const totals = calculateTotals(updatedIngredienti, state.data.availableIngredients);
            if (totals) {
                updateCalculations(totals);
                toast.success('Ingrediente aggiornato con successo');
            }

        } catch (err) {
            const errorMessage = 'Errore nell\'aggiornamento dell\'ingrediente';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        }
    }, [recipeId, state.data, updateIngredienti, calculateTotals, updateCalculations, setError]);

    const removeIngrediente = useCallback(async (index) => {
        setLoading(true);
        try {
            const updatedIngredienti = state.data.ingredienti.filter((_, i) => i !== index);

            if (recipeId !== 'new') {
                const payloadData = {
                    ingredienti: updatedIngredienti.map(ing => ({
                        ingrediente: ing.ingrediente._id || ing.ingrediente,
                        quantita: ing.quantita,
                        unitaMisura: ing.unitaMisura._id || ing.unitaMisura,
                        caloPeso: ing.caloPeso
                    }))
                };
                await ingredientiService.saveTempIngredienti(recipeId, payloadData);
            }

            updateIngredienti(updatedIngredienti);
            const totals = calculateTotals(updatedIngredienti, state.data.availableIngredients);
            if (totals) {
                updateCalculations(totals);
                toast.success('Ingrediente rimosso con successo');
            }

        } catch (err) {
            const errorMessage = 'Errore nella rimozione dell\'ingrediente';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [recipeId, state.data, setError, setLoading, updateCalculations, updateIngredienti, calculateTotals]);

    return {
        ingredienti: state.data.ingredienti,
        availableIngredients: state.data.availableIngredients,
        units: state.data.units,
        totals: state.calculations.totals,
        loading: state.ui.loading,
        error: state.ui.error,
        addIngrediente,
        updateIngrediente,
        removeIngrediente,
        updateIngredienti
    };
};

export default useIngredientCalculations;
