import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookingOptions } from './useCookingOption';

export const useCooking = (recipeId) => {
    const [cotture, setCotture] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { tipiCottura } = useCookingOptions();

    useEffect(() => {
        if (recipeId && recipeId !== 'new') {
            const fetchCotture = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`/api/ricette/${recipeId}/cooking`);
                    setCotture(response.data);
                } catch (err) {
                    console.error('Errore fetch:', err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchCotture();
        }
    }, [recipeId]);

    const addCottura = async (cottura) => {
        try {
            if (recipeId === 'new') {
                const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
                const newCottura = { 
                    ...cottura,
                    _id: tempId,
                    tipoCottura: {
                        _id: cottura.tipoCottura,
                        name: tipiCottura.find(t => t._id === cottura.tipoCottura)?.name
                    }
                };
                setCotture(prev => [...prev, newCottura]);
                return newCottura;
            } else {
                const payload = {
                    ...cottura,
                    temperatura: Number(cottura.temperatura),
                    tempoCottura: Number(cottura.tempoCottura)
                };
                const response = await axios.post(`/api/ricette/${recipeId}/cooking`, payload);
                setCotture(prev => [...prev, response.data]);
                return response.data;
            }
        } catch (err) {
            console.error('Errore addCottura:', err);
            setError(err.message);
            throw err;
        }
    };

    const updateCottura = async (index, cottura) => {
        try {
            if (recipeId === 'new') {
                const updatedCotture = [...cotture];
                updatedCotture[index] = {
                    ...cottura,
                    _id: cotture[index]._id,
                    tipoCottura: {
                        _id: cottura.tipoCottura,
                        name: tipiCottura.find(t => t._id === cottura.tipoCottura)?.name
                    }
                };
                setCotture(updatedCotture);
                return updatedCotture[index];
            } else {
                const payload = {
                    ...cottura,
                    temperatura: Number(cottura.temperatura),
                    tempoCottura: Number(cottura.tempoCottura)
                };
                const response = await axios.put(
                    `/api/ricette/${recipeId}/cooking/${cotture[index]._id}`, 
                    payload
                );
                setCotture(prev => {
                    const updated = [...prev];
                    updated[index] = response.data;
                    return updated;
                });
                return response.data;
            }
        } catch (err) {
            console.error('Errore updateCottura:', err);
            setError(err.message);
            throw err;
        }
    };

    const removeCottura = async (index) => {
        try {
            if (recipeId === 'new') {
                setCotture(prev => prev.filter((_, i) => i !== index));
            } else {
                await axios.delete(`/api/ricette/${recipeId}/cooking/${cotture[index]._id}`);
                setCotture(prev => prev.filter((_, i) => i !== index));
            }
        } catch (err) {
            console.error('Errore removeCottura:', err);
            setError(err.message);
            throw err;
        }
    };

    const reorderCotture = async (sourceIndex, destinationIndex) => {
        try {
            const newCotture = Array.from(cotture);
            const [removed] = newCotture.splice(sourceIndex, 1);
            newCotture.splice(destinationIndex, 0, removed);
            
            const updatedCotture = newCotture.map((cottura, index) => ({
                ...cottura,
                ordine: index
            }));

            if (recipeId === 'new') {
                setCotture(updatedCotture);
            } else {
                await axios.put(`/api/ricette/${recipeId}/cooking/reorder`, {
                    sourceIndex,
                    destinationIndex
                });
                setCotture(updatedCotture);
            }
        } catch (err) {
            console.error('Errore reorderCotture:', err);
            setError(err.message);
            throw err;
        }
    };

    const saveTempCotture = async (newRecipeId) => {
        try {
            if (cotture.length > 0) {
                console.log('Salvataggio cotture:', cotture);
                const promises = cotture.map((cottura, index) => {
                    const { _id, ...cotturaData } = cottura;
                    const payload = {
                        ...cotturaData,
                        ordine: index,
                        tipoCottura: cottura.tipoCottura._id,
                        temperatura: Number(cottura.temperatura),
                        tempoCottura: Number(cottura.tempoCottura)
                    };
                    console.log('Payload cottura:', payload);
                    return axios.post(`/api/ricette/${newRecipeId}/cooking`, payload);
                });
                await Promise.all(promises);
            }
        } catch (err) {
            console.error('Errore saveTempCotture:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.message);
            throw err;
        }
    };

    return {
        cotture,
        loading,
        error,
        addCottura,
        updateCottura,
        removeCottura,
        reorderCotture,
        saveTempCotture
    };
};
