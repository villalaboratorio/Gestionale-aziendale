import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LavorazioneApi from '../services/LavorazioneApi';

const useLavorazione = (id) => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        lavorazione: {},
        collections: {
            clienti: [],
            ricette: [],
            tipiLavorazione: [],
            statiLavorazione: []
        },
        loading: true,
        error: null
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const [collectionsRes, lavorazioneRes] = await Promise.all([
                LavorazioneApi.getCollections(),
                id ? LavorazioneApi.getLavorazione(id) : { data: {} }
            ]);

            setState({
                lavorazione: lavorazioneRes.data || {},
                collections: collectionsRes.data || {
                    clienti: [],
                    ricette: [],
                    tipiLavorazione: [],
                    statiLavorazione: []
                },
                loading: false,
                error: null
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    }, [id]);

    const handleSave = useCallback(async (updates) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const result = id
                ? await LavorazioneApi.updateLavorazione(id, updates)
                : await LavorazioneApi.createLavorazione(updates);

            setState(prev => ({
                ...prev,
                lavorazione: result.data,
                loading: false
            }));

            toast.success(id ? 'Lavorazione aggiornata' : 'Lavorazione creata');
            return result;
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
            toast.error(error.message);
            throw error;
        }
    }, [id]);

    const handleDelete = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            await LavorazioneApi.deleteLavorazione(id);
            navigate('/lavorazioni');
            toast.success('Lavorazione eliminata');
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
            toast.error(error.message);
            throw error;
        }
    }, [id, navigate]);

    return {
        ...state,
        isNew: !id,
        actions: {
            fetchData,
            handleSave,
            handleDelete
        }
    };
};

export default useLavorazione;