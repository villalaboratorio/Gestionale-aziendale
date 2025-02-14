import { useState, useCallback } from 'react';

const useAssemblaggio = (lavorazione, onUpdate) => {
    const [state, setState] = useState({
        loading: false,
        error: null,
        saving: false
    });

    const handleUpdateAssemblaggio = useCallback(async (data) => {
        setState(prev => ({ ...prev, saving: true }));
        try {
            // Logica di aggiornamento
            onUpdate('assemblaggio', data);
            setState(prev => ({ ...prev, saving: false }));
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                saving: false,
                error: 'Errore durante l\'aggiornamento dell\'assemblaggio'
            }));
        }
    }, [onUpdate]);

    return {
        ...state,
        datiAssemblaggio: lavorazione?.assemblaggio,
        handleUpdateAssemblaggio
    };
};

export default useAssemblaggio;
