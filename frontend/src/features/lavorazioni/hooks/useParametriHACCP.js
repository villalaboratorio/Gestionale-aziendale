import { useState, useCallback } from 'react';
import axios from 'axios';

const useParametriHACCP = (lavorazioneId) => {
    const [parametri, setParametri] = useState({
        temperature: [],
        verifiche: [],
        loading: false,
        error: null
    });

    const registraTemperatura = useCallback(async (fase, datiTemperatura) => {
        setParametri(prev => ({ ...prev, loading: true }));
        try {
            const response = await axios.post(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/${fase}/temperatura`,
                datiTemperatura
            );
            setParametri(prev => ({
                ...prev,
                temperature: [...prev.temperature, response.data],
                error: null
            }));
            return response.data;
        } catch (error) {
            setParametri(prev => ({ ...prev, error: error.message }));
            throw error;
        } finally {
            setParametri(prev => ({ ...prev, loading: false }));
        }
    }, [lavorazioneId]);

    const verificaParametri = useCallback(async (fase) => {
        setParametri(prev => ({ ...prev, loading: true }));
        try {
            const response = await axios.get(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/${fase}/verifica-haccp`
            );
            setParametri(prev => ({
                ...prev,
                verifiche: [...prev.verifiche, response.data],
                error: null
            }));
            return response.data;
        } catch (error) {
            setParametri(prev => ({ ...prev, error: error.message }));
            throw error;
        } finally {
            setParametri(prev => ({ ...prev, loading: false }));
        }
    }, [lavorazioneId]);

    const getStoricoPametri = useCallback(async () => {
        setParametri(prev => ({ ...prev, loading: true }));
        try {
            const response = await axios.get(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/parametri-haccp`
            );
            setParametri(prev => ({
                ...prev,
                temperature: response.data.temperature,
                verifiche: response.data.verifiche,
                error: null
            }));
        } catch (error) {
            setParametri(prev => ({ ...prev, error: error.message }));
        } finally {
            setParametri(prev => ({ ...prev, loading: false }));
        }
    }, [lavorazioneId]);

    return {
        ...parametri,
        registraTemperatura,
        verificaParametri,
        getStoricoPametri
    };
};

export default useParametriHACCP;
