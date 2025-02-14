import { useState, useCallback, useEffect } from 'react';
import { fasiService } from '../services/apiService';

export const useFasi = (recipeId) => {
    const [fasi, setFasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            if (recipeId === 'new') {
                setFasi(prev => prev.filter((_, idx) => idx !== index));
                return;
            }

            await fasiService.deleteFase(recipeId, index);
            setFasi(prev => prev.filter((_, idx) => idx !== index));
        } catch (err) {
            console.error('Errore nella rimozione della fase:', err);
            throw err;
        }
    }, [recipeId]);

    const reorderFasi = useCallback(async (sourceIndex, destinationIndex) => {
        try {
            const newFasi = Array.from(fasi);
            const [removed] = newFasi.splice(sourceIndex, 1);
            newFasi.splice(destinationIndex, 0, removed);

            if (recipeId === 'new') {
                setFasi(newFasi);
                return;
            }

            await fasiService.reorderFasi(recipeId, newFasi.map(f => f._id));
            setFasi(newFasi);
        } catch (err) {
            console.error('Errore nel riordinamento delle fasi:', err);
            throw err;
        }
    }, [recipeId, fasi]);

    const saveTempFasi = useCallback(async (newRecipeId) => {
        if (!fasi.length) return;
        
        try {
            const promises = fasi.map(fase => 
                fasiService.createFase(newRecipeId, {
                    tipoLavorazione: fase.tipoLavorazione,
                    metodo: fase.metodo,
                    tempo: fase.tempo,
                    descrizione: fase.descrizione,
                    ordine: fase.ordine
                })
            );
            
            await Promise.all(promises);
        } catch (err) {
            console.error('Errore nel salvataggio delle fasi temporanee:', err);
            throw err;
        }
    }, [fasi]);

    return {
        fasi,
        loading,
        error,
        addFase,
        updateFase,
        removeFase,
        reorderFasi,
        saveTempFasi,
        refreshFasi: loadFasi
    };
};
