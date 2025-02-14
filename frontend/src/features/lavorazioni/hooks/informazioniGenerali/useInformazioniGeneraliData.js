import { useState, useEffect } from 'react';
import { useStore } from '../../../store/lavorazioneStore';

const useIngredientiHaccpData = () => {
    const { 
        lavorazione,
        collections,
        updateIngredientiHACCP,
        loading,
        error 
    } = useStore();

    const [state, setState] = useState({
        verifiche: lavorazione?.verificheHaccp || {},
        loading: false,
        error: null
    });

    useEffect(() => {
        const ricettaId = lavorazione?.ricetta?._id;
        const ricettaCompleta = collections?.ricette?.find(r => r._id === ricettaId);

        if (!ricettaId) {
            setState(prev => ({
                ...prev,
                error: 'Seleziona prima una ricetta nelle informazioni generali'
            }));
            return;
        }

        if (!ricettaCompleta?.ingredienti?.length) {
            setState(prev => ({
                ...prev,
                error: 'La ricetta selezionata non ha ingredienti'
            }));
            return;
        }

        setState(prev => ({
            ...prev,
            verifiche: lavorazione?.verificheHaccp || {},
            error: null
        }));
    }, [lavorazione?.ricetta?._id, collections?.ricette, lavorazione?.verificheHaccp]);

    return {
        ricetta: collections?.ricette?.find(r => r._id === lavorazione?.ricetta?._id),
        verifiche: state.verifiche,
        loading: loading || state.loading,
        error: error || state.error,
        updateVerifica: updateIngredientiHACCP
    };
};

export default useIngredientiHaccpData;
