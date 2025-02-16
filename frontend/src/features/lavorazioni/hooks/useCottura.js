import { useState, useCallback, useEffect, useRef } from 'react';
import LavorazioneApi from '../services/LavorazioneApi';

const useCottura = (lavorazioneId) => {
    const [cotture, setCotture] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cache = useRef(new Map());
    const [ricettaParams, setRicettaParams] = useState(null);

    const getCotture = useCallback(async (force = false) => {
        console.group('📥 Recupero Cotture');
        const cacheKey = `cotture-${lavorazioneId}`;
        
        if (!force && cache.current.has(cacheKey)) {
            setCotture(cache.current.get(cacheKey));
            return;
        }

        setLoading(true);
        try {
            const response = await LavorazioneApi.getCotture(lavorazioneId);
            if (response.success) {
                const cottureData = response.data;
                cache.current.set(cacheKey, cottureData);
                setCotture(cottureData);
                
                if (response.ricettaParams) {
                    setRicettaParams(response.ricettaParams);
                }
            }
        } catch (err) {
            setError(err.message);
            console.error('Errore recupero cotture:', err);
        } finally {
            setLoading(false);
            console.groupEnd();
        }
    }, [lavorazioneId]);

    const handleApiCall = useCallback(async (apiFunction, ...args) => {
        const startTime = Date.now();
        let loadingTimeout;

        try {
            loadingTimeout = setTimeout(() => setLoading(true), 500);
            
            const response = await apiFunction(...args);
            if (response.success) {
                setCotture(response.data);
                setError(null);
            }
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            clearTimeout(loadingTimeout);
            if (Date.now() - startTime > 500) {
                setLoading(false);
            }
        }
    }, []);

    const addCottura = useCallback(async (datiCottura = {}) => {
        const defaultParams = ricettaParams || {};
        const cotturaData = {
            ...defaultParams,
            ...datiCottura
        };
        return handleApiCall(() => LavorazioneApi.addCottura(lavorazioneId, cotturaData));
    }, [lavorazioneId, handleApiCall, ricettaParams]);

    const updateCottura = useCallback(async (cotturaId, field, value) => {
        console.group('📝 Update Cottura');
        try {
            const cottura = cotture.find(c => c._id === cotturaId);
            if (!cottura) {
                throw new Error('Cottura non trovata');
            }

            const response = await LavorazioneApi.updateCottura(lavorazioneId, cotturaId, {
                [field]: value
            });

            if (response.success) {
                await getCotture(true);
            }
            return response;
        } finally {
            console.groupEnd();
        }
    }, [lavorazioneId, cotture, getCotture]);

    const removeCottura = useCallback(async (cotturaId) => {
        console.group('🗑️ Rimozione Cottura');
        try {
            const response = await handleApiCall(() => 
                LavorazioneApi.removeCottura(lavorazioneId, cotturaId)
            );
            if (response.success) {
                await getCotture(true);
            }
            return response;
        } finally {
            console.groupEnd();
        }
    }, [lavorazioneId, handleApiCall, getCotture]);

    const startCottura = useCallback(async (cotturaId) => {
        console.group('🔥 Avvio Cottura');
        try {
            const cottura = cotture.find(c => c._id === cotturaId);
            if (!cottura) {
                throw new Error('Cottura non trovata');
            }

            const response = await LavorazioneApi.startCottura(lavorazioneId, {
                cotturaId,
                tipoCottura: cottura.tipoCottura?._id || cottura.tipoCottura,
                temperaturaTarget: Number(cottura.temperaturaTarget) || 0,
                addetto: cottura.addetto || 'Da assegnare'
            });

            if (response.success) {
                await getCotture(true);
            }
            return response;
        } finally {
            console.groupEnd();
        }
    }, [lavorazioneId, cotture, getCotture]);

    const completaCottura = useCallback(async (cotturaId) => {
        console.group('✅ Completamento Cottura');
        try {
            const cottura = cotture.find(c => c._id === cotturaId);
            if (!cottura) {
                throw new Error('Cottura non trovata');
            }

            const response = await LavorazioneApi.completeCottura(lavorazioneId, {
                cotturaId,
                temperaturaFinale: Number(cottura.temperaturaTarget) || 0,
                verificatoDa: cottura.addetto || 'Non specificato'
            });

            if (response.success) {
                await getCotture(true);
            }
            return response;
        } finally {
            console.groupEnd();
        }
    }, [lavorazioneId, cotture, getCotture]);

    useEffect(() => {
        if (lavorazioneId) {
            getCotture();
        }
        
        // Catturiamo il riferimento alla cache all'interno dell'effect
        const currentCache = cache.current;
        
        return () => {
            currentCache.clear();
        };
    }, [lavorazioneId, getCotture]);
    
    return {
        cotture,
        loading,
        error,
        ricettaParams,
        getCotture,
        addCottura,
        updateCottura,
        removeCottura,
        startCottura,
        completaCottura
    };
};

export default useCottura;
