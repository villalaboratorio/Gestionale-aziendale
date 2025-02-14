import { useCallback } from 'react';
import { useStore } from '../../../store/lavorazioneStore';

const useIngredientiHaccpSave = () => {
    const { 
        lavorazione,
        updateIngredientiHACCP,
        handleSave,
        loading,
        error 
    } = useStore();

    const validateData = useCallback((verifiche) => {
        const errors = {};
        Object.entries(verifiche).forEach(([ingredienteId, verifica]) => {
            if (!verifica.tmc) {
                errors[`${ingredienteId}.tmc`] = 'TMC obbligatorio';
            }
            if (!verifica.lotto) {
                errors[`${ingredienteId}.lotto`] = 'Lotto obbligatorio';
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }, []);

    const salvaVerifiche = useCallback(async (verifiche) => {
        const { isValid, errors } = validateData(verifiche);
        
        if (!isValid) {
            throw new Error('Validazione fallita', { errors });
        }

        updateIngredientiHACCP(verifiche);
        return handleSave();
    }, [updateIngredientiHACCP, handleSave, validateData]);

    return {
        saving: loading,
        saveError: error,
        lastSaved: lavorazione.lastUpdate,
        salvaVerifiche
    };
};

export default useIngredientiHaccpSave;
