import { useEffect } from 'react';
import { useStore } from '../../../../../../store/lavorazioneStore';

const useIngredientiHaccp = () => {
    const { 
        lavorazione,
        loading,
        error,
        initializeVerificheHaccp,
        updateVerificaHaccp,
        getVerificheHaccpStats,
        handleSave
    } = useStore();

    useEffect(() => {
        initializeVerificheHaccp();
    }, [initializeVerificheHaccp]);

    const stats = getVerificheHaccpStats();

    const actions = {
        updateVerifica: updateVerificaHaccp,
        handleSave,
        refreshData: initializeVerificheHaccp
    };

    return {
        ricetta: lavorazione?.ricetta,
        verifiche: lavorazione?.verificheHaccp || {},
        loading,
        error,
        isDirty: lavorazione?.isDirty || false,
        lastSaved: lavorazione?.lastUpdate,
        ...stats,
        actions
    };
};

export default useIngredientiHaccp;
