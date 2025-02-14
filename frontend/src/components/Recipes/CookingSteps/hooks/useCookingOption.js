import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useCookingOptions = () => {
    const [tipiCottura, setTipiCottura] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previousState, setPreviousState] = useState(null);

    const fetchOptions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tipo-cotture');
            setTipiCottura(response.data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento dei tipi di cottura');
            console.error('Errore API:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    const addCookingOption = useCallback(async (data) => {
        try {
            setPreviousState(tipiCottura);
            const response = await axios.post('/api/tipo-cotture', data);
            setTipiCottura(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            if (previousState) setTipiCottura(previousState);
            throw err;
        }
    }, [tipiCottura, previousState]);

    const updateCookingOption = useCallback(async (id, data) => {
        try {
            setPreviousState(tipiCottura);
            const response = await axios.put(`/api/tipo-cotture/${id}`, data);
            setTipiCottura(prev => prev.map(tipo => 
                tipo._id === id ? response.data : tipo
            ));
            return response.data;
        } catch (err) {
            if (previousState) setTipiCottura(previousState);
            throw err;
        }
    }, [tipiCottura, previousState]);

    const deleteCookingOption = useCallback(async (id) => {
        try {
            setPreviousState(tipiCottura);
            await axios.delete(`/api/tipo-cotture/${id}`);
            setTipiCottura(prev => prev.filter(tipo => tipo._id !== id));
        } catch (err) {
            if (previousState) setTipiCottura(previousState);
            throw err;
        }
    }, [tipiCottura, previousState]);

    return { 
        tipiCottura, 
        loading, 
        error,
        addCookingOption,
        updateCookingOption,
        deleteCookingOption,
        refreshOptions: fetchOptions 
    };
};
