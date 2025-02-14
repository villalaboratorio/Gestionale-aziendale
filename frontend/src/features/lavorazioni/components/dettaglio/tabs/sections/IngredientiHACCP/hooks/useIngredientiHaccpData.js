import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../../store/lavorazioneStore';

const useIngredientiHaccpData = () => {
    const {
        lavorazione,
        collections,
        updateVerificaIngrediente,
        handleSave
    } = useStore();

    const [state, setState] = useState({
        verifiche: lavorazione?.verificheHaccp || {},
        loading: false,
        error: null
    });

    const initializeVerifiche = useCallback(() => {
        const ricettaId = lavorazione?.ricetta?._id;
        if (!ricettaId) {
            setState(prev => ({
                ...prev,
                error: 'Seleziona prima una ricetta nelle informazioni generali',
                verifiche: {}
            }));
            return;
        }

        const ricettaCompleta = collections?.ricette?.find(r => r._id === ricettaId);
        const ingredienti = ricettaCompleta?.ingredienti || [];

        if (!ingredienti.length) {
            setState(prev => ({
                ...prev,
                error: 'La ricetta selezionata non ha ingredienti',
                verifiche: {}
            }));
            return;
        }

        const verificheIniziali = {};
        ingredienti.forEach(ing => {
            verificheIniziali[ing._id] = {
                tmc: '',
                lotto: '',
                verificato: false,
                ...lavorazione.verificheHaccp?.[ing._id]
            };
        });

        setState(prev => ({
            ...prev,
            verifiche: verificheIniziali,
            error: null
        }));
    }, [lavorazione?.ricetta?._id, collections?.ricette, lavorazione.verificheHaccp]);

    useEffect(() => {
        initializeVerifiche();
    }, [initializeVerifiche]);

    const updateVerifica = useCallback((ingredienteId, campo, valore) => {
        updateVerificaIngrediente(ingredienteId, {
            ...state.verifiche[ingredienteId],
            [campo]: valore
        });
    }, [updateVerificaIngrediente, state.verifiche]);

    return {
        ricetta: collections?.ricette?.find(r => r._id === lavorazione?.ricetta?._id),
        verifiche: lavorazione?.verificheHaccp || {},
        loading: state.loading,
        error: state.error,
        onUpdateVerifica: updateVerifica,
        handleSave
    };
};

export default useIngredientiHaccpData;