import { useState, useCallback, useEffect } from 'react';
import { fasiService } from '../services/apiService';

const validateFase = (faseData) => {
    const errors = {};
    if (!faseData.tipoLavorazione) errors.tipoLavorazione = 'Tipo lavorazione obbligatorio';
    if (!faseData.metodo) errors.metodo = 'Metodo obbligatorio';
    if (faseData.tempo && faseData.tempo < 0) errors.tempo = 'Tempo non valido';
    return errors;
};

export const useFasi = (recipeId) => {
    const [fasi, setFasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previousState, setPreviousState] = useState(null);

    const loadFasi = useCallback(async () => {
        if (!recipeId || recipeId === 'new') {
            setFasi([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await fasiService.getFasi(recipeId);
            setFasi(data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento delle fasi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [recipeId]);

    useEffect(() => {
        loadFasi();
    }, [loadFasi]);

    const addFase = useCallback(async (faseData) => {
        const validationErrors = validateFase(faseData);
        if (Object.keys(validationErrors).length > 0) {
            throw new Error({ validationErrors });
        }

        try {
            if (recipeId === 'new') {
                const tempFase = {
                    _id: `temp-${Date.now()}`,
                    ...faseData,
                    ordine: fasi.length
                };
                setFasi(prev => [...prev, tempFase]);
                return tempFase;
            }

            const newFase = await fasiService.createFase(recipeId, {
                ...faseData,
                ordine: fasi.length
            });
            setFasi(prev => [...prev, newFase]);
            return newFase;
        } catch (err) {
            console.error('Errore nell\'aggiunta della fase:', err);
            throw err;
        }
    }, [recipeId, fasi]);

    const updateFase = useCallback(async (index, data) => {
        const validationErrors = validateFase(data);
        if (Object.keys(validationErrors).length > 0) {
            throw new Error({ validationErrors });
        }

        try {
            if (recipeId === 'new') {
                setFasi(prev => prev.map((fase, idx) =>
                    idx === index ? { ...fase, ...data } : fase
                ));
                return;
            }

            const updatedFase = await fasiService.updateFase(recipeId, index, data);
            setFasi(prev => prev.map((fase, idx) =>
                idx === index ? updatedFase : fase
            ));
        } catch (err) {
            console.error('Errore nell\'aggiornamento della fase:', err);
            throw err;
        }
    }, [recipeId]);

    const removeFase = useCallback(async (index) => {
        try {
            setPreviousState(fasi);
            
            if (recipeId === 'new') {
                setFasi(prev => prev.filter((_, idx) => idx !== index));
                return;
            }

            setFasi(prev => prev.filter((_, idx) => idx !== index));
            await fasiService.deleteFase(recipeId, index);
        } catch (err) {
            console.error('Errore nella rimozione della fase:', err);
            if (previousState) {
                setFasi(previousState);
            }
            throw err;
        }
    }, [recipeId, fasi, previousState]);

    const reorderFasi = useCallback(async (sourceIndex, destinationIndex) => {
        try {
            setPreviousState(fasi);
            const newFasi = Array.from(fasi);
            const [removed] = newFasi.splice(sourceIndex, 1);
            newFasi.splice(destinationIndex, 0, removed);

            // Aggiornamento ottimistico UI
            setFasi(newFasi);

            if (recipeId === 'new') {
                return;
            }

            const updatedOrder = newFasi.map((fase, index) => ({
                ...fase,
                ordine: index
            }));

            await fasiService.reorderFasi(recipeId, updatedOrder.map(f => f._id));
        } catch (err) {
            console.error('Errore nel riordinamento delle fasi:', err);
            if (previousState) {
                setFasi(previousState);
            }
            throw err;
        }
    }, [recipeId, fasi, previousState]);

    const onDragEnd = useCallback(async (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        await reorderFasi(sourceIndex, destinationIndex);
    }, [reorderFasi]);

    return {
        fasi,
        loading,
        error,
        addFase,
        updateFase,
        removeFase,
        reorderFasi,
        onDragEnd,
        refreshFasi: loadFasi
    };
};

export default useFasi;
