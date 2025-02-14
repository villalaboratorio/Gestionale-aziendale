import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';

const useInformazioniGeneraliSave = ({ localData, setIsDirty }) => {
    const [saveState, setSaveState] = useState({
        loading: false,
        error: null,
        lastSaved: null
    });

    const validateData = useCallback((data) => {
        const requiredFields = ['cliente', 'ricetta', 'tipoLavorazione', 'dataLavorazione'];
        const errors = {};

        requiredFields.forEach(field => {
            if (!data[field] || !data[field]._id) {
                errors[field] = 'Campo obbligatorio';
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }, []);

    const prepareDataForSave = useCallback((data) => ({
        ...data,
        cliente: data.cliente._id,
        ricetta: data.ricetta._id,
        tipoLavorazione: data.tipoLavorazione._id
    }), []);

    const saveLavorazione = useCallback(async (data) => {
        const isNew = !data._id;
        const preparedData = prepareDataForSave(data);
        
        try {
            if (isNew) {
                return await apiService.post('/lavorazioni', preparedData);
            }
            return await apiService.put(`/lavorazioni/${data._id}`, preparedData);
        } catch (error) {
            throw new Error(`Errore durante il ${isNew ? 'creazione' : 'aggiornamento'}: ${error.message}`);
        }
    }, [prepareDataForSave]);

    const handleSave = useCallback(async () => {
        setSaveState(prev => ({ ...prev, loading: true }));
        
        try {
            const { isValid, errors } = validateData(localData);
            if (!isValid) {
                // Utilizziamo gli errors per dare un feedback più specifico
                const errorMessages = Object.entries(errors)
                    .map(([field, message]) => `${field}: ${message}`)
                    .join('\n');
                    
                toast.error(`Errori di validazione:\n${errorMessages}`);
                throw new Error('Validazione fallita', { cause: errors });
            }

            const result = await saveLavorazione(localData);
            
            setSaveState({
                loading: false,
                error: null,
                lastSaved: new Date()
            });

            setIsDirty(false);
            toast.success('Lavorazione salvata con successo');
            
            return result;
        } catch (error) {
            setSaveState({
                loading: false,
                error: error.message,
                lastSaved: null,
                validationErrors: error.cause // Memorizziamo anche gli errori di validazione
            });
            toast.error(error.message);
            throw error;
        }
    }, [localData, validateData, saveLavorazione, setIsDirty]);

    const handleDelete = useCallback(async (id) => {
        setSaveState(prev => ({ ...prev, loading: true }));
        
        try {
            await apiService.delete(`/lavorazioni/${id}`);
            setSaveState({
                loading: false,
                error: null,
                lastSaved: new Date()
            });
            toast.success('Lavorazione eliminata con successo');
        } catch (error) {
            setSaveState({
                loading: false,
                error: error.message,
                lastSaved: null
            });
            toast.error(`Errore durante l'eliminazione: ${error.message}`);
            throw error;
        }
    }, []);

    return {
        saving: saveState.loading,
        saveError: saveState.error,
        lastSaved: saveState.lastSaved,
        handleSave,
        handleDelete,
        saveLavorazione
    };
};

export default useInformazioniGeneraliSave;
