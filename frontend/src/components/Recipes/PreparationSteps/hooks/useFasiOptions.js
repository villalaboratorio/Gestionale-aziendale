import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFasiOptions = () => {
    const [tipi, setTipi] = useState([]);
    const [metodi, setMetodi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const [tipiRes, metodiRes] = await Promise.all([
                    axios.get('/api/fasi-types'),
                    axios.get('/api/fasi-methods')
                ]);

                setTipi(tipiRes.data);
                setMetodi(metodiRes.data);
                setError(null);
            } catch (err) {
                setError('Errore nel caricamento delle opzioni');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    return {
        tipi,
        metodi,
        loading,
        error
    };
};
