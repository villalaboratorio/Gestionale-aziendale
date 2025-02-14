import { useState, useCallback, useEffect } from 'react';
import { cookingService } from '../services/cookingApiService';

export const useCookingSteps = (recipeId) => {
    const [cotture, setCotture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previousState, setPreviousState] = useState(null);

    const loadCotture = useCallback(async () => {
        if (!recipeId || recipeId === 'new') {
            setCotture([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await cookingService.getCotture(recipeId);
            setCotture(data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento delle cotture');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [recipeId]);

    useEffect(() => {
        loadCotture();
    }, [loadCotture]);

    const addCottura = useCallback(async (cotturaData) => {
        try {
            const tempCottura = {
                _id: `temp-${Date.now()}`,
                ...cotturaData,
                ordine: cotture.length
            };
            setCotture(prev => [...prev, tempCottura]);
            return tempCottura;
        } catch (err) {
            console.error('Errore nell\'aggiunta della cottura:', err);
            throw err;
        }
    }, [cotture]);

    const updateCottura = useCallback(async (index, data) => {
        try {
            setCotture(prev => prev.map((cottura, idx) =>
                idx === index ? { ...cottura, ...data } : cottura
            ));
        } catch (err) {
            console.error('Errore aggiornamento cottura:', err);
            throw err;
        }
    }, []);

    const removeCottura = useCallback(async (index) => {
        try {
            setPreviousState(cotture);
            setCotture(prev => {
                const updated = prev.filter((_, idx) => idx !== index);
                return updated.map((c, idx) => ({ ...c, ordine: idx }));
            });
        } catch (err) {
            if (previousState) {
                setCotture(previousState);
            }
            console.error('Errore nella rimozione della cottura:', err);
            throw err;
        }
    }, [cotture, previousState]);

    const reorderCotture = useCallback(async (sourceIndex, destinationIndex) => {
        try {
            setPreviousState(cotture);
            const newCotture = Array.from(cotture);
            const [removed] = newCotture.splice(sourceIndex, 1);
            newCotture.splice(destinationIndex, 0, removed);

            setCotture(newCotture.map((c, index) => ({
                ...c,
                ordine: index
            })));
        } catch (err) {
            if (previousState) {
                setCotture(previousState);
            }
            console.error('Errore nel riordinamento delle cotture:', err);
            throw err;
        }
    }, [cotture, previousState]);

    const saveTempCotture = useCallback(async (newRecipeId) => {
        if (!cotture.length) return;
        
        try {
            const cottureData = cotture.map((cottura, index) => ({
                tipoCottura: cottura.tipoCottura._id || cottura.tipoCottura,
                temperatura: Number(cottura.temperatura),
                tempoCottura: Number(cottura.tempoCottura),
                note: cottura.note || '',
                ordine: index
            }));

            return cookingService.saveTempCotture(newRecipeId || recipeId, cottureData);
        } catch (err) {
            console.error('Errore nel salvataggio delle cotture temporanee:', err);
            throw err;
        }
    }, [cotture, recipeId]);

    const getCotture = useCallback(() => {
        return cotture;
    }, [cotture]);

    return {
        cotture,
        loading,
        error,
        addCottura,
        updateCottura,
        removeCottura,
        reorderCotture,
        saveTempCotture,
        refreshCotture: loadCotture,
        getCotture
    };
};

export default useCookingSteps;
