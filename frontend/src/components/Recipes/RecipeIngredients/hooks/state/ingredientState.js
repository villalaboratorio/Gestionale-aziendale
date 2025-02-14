import { useState, useCallback } from 'react';

const initialState = {
    data: {
        ingredienti: [],
        availableIngredients: [],
        units: []
    },
    calculations: {
        totals: {
            rawCost: 0,
            finalCost: 0,
            weightLoss: 0
        }
    },
    ui: {
        loading: false,
        error: null
    }
};

export const useIngredientState = () => {
    const [state, setState] = useState(initialState);

    const setInitialData = useCallback((ingredienti, availableIngredients, units) => {
        setState(prev => ({
            ...prev,
            data: {
                ingredienti: ingredienti || [],
                availableIngredients: availableIngredients || [],
                units: units || []
            }
        }));
    }, []);

    const updateIngredienti = useCallback((ingredienti) => {
        setState(prev => ({
            ...prev,
            data: {
                ...prev.data,
                ingredienti
            }
        }));
    }, []);

    const updateCalculations = useCallback((totals) => {
        setState(prev => ({
            ...prev,
            calculations: {
                totals
            }
        }));
    }, []);

    const setLoading = useCallback((loading) => {
        setState(prev => ({
            ...prev,
            ui: {
                ...prev.ui,
                loading
            }
        }));
    }, []);

    const setError = useCallback((error) => {
        setState(prev => ({
            ...prev,
            ui: {
                ...prev.ui,
                error
            }
        }));
    }, []);

    const resetState = useCallback(() => {
        setState(initialState);
    }, []);

    return {
        state,
        setInitialData,
        updateIngredienti,
        updateCalculations,
        setLoading,
        setError,
        resetState
    };
};

export default useIngredientState;
