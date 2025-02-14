import { useState, useCallback, useEffect } from 'react';
import { useLavorazioneContext } from '../../../../../../context/LavorazioneContext';

const createInitialPhase = () => ({
    oraInizio: '',
    oraFine: '',
    operatore: '',
    isStarted: false,
    isCompleted: false
});

const createInitialPassaggio = () => ({
    id: Date.now(),
    pelaturaMondatura: createInitialPhase(),
    lavaggioPulizia: createInitialPhase(),
    taglioMacinaAffetta: createInitialPhase()
});

const usePassaggiLavorazione = () => {
    const { data, actions } = useLavorazioneContext();
    const [state, setState] = useState({
        passaggi: [],
        loading: false,
        error: null
    });

    useEffect(() => {
        if (data?.lavorazione?.passaggi) {
            setState(prev => ({
                ...prev,
                passaggi: data.lavorazione.passaggi
            }));
        }
    }, [data?.lavorazione]);

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // This will format to "yyyy-MM-ddThh:mm"
    };

    const handlePhaseAction = useCallback(async (passaggioId, phaseKey, action) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const now = new Date().toISOString();
            const formattedNow = formatDateForInput(now);
            const updatedPassaggi = state.passaggi.map(pass => {
                if (pass.id !== passaggioId) return pass;
                return {
                    ...pass,
                    [phaseKey]: {
                        ...pass[phaseKey],
                        ...(action === 'start' ? {
                            oraInizio: formattedNow,
                            isStarted: true
                        } : {
                            oraFine: formattedNow,
                            isCompleted: true
                        })
                    }
                };
            });

            await actions.handleSave({
                ...data.lavorazione,
                passaggi: updatedPassaggi
            });

            setState(prev => ({
                ...prev,
                passaggi: updatedPassaggi,
                loading: false,
                error: null
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: err.message
            }));
        }
    }, [state.passaggi, data.lavorazione, actions]);
    const handleOperatorUpdate = useCallback(async (passaggioId, phaseKey, operatore) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const updatedPassaggi = state.passaggi.map(pass => {
                if (pass.id !== passaggioId) return pass;
                return {
                    ...pass,
                    [phaseKey]: {
                        ...pass[phaseKey],
                        operatore
                    }
                };
            });

            await actions.handleSave({
                ...data.lavorazione,
                passaggi: updatedPassaggi
            });

            setState(prev => ({
                ...prev,
                passaggi: updatedPassaggi,
                loading: false,
                error: null
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: err.message
            }));
        }
    }, [state.passaggi, data.lavorazione, actions]);

    const addPassaggio = useCallback(() => {
        const newPassaggio = createInitialPassaggio();
        setState(prev => ({
            ...prev,
            passaggi: [...prev.passaggi, newPassaggio]
        }));
    }, []);

    return {
        passaggi: state.passaggi,
        loading: state.loading,
        error: state.error,
        handlePhaseAction,
        handleOperatorUpdate,
        addPassaggio,
        resetError: () => setState(prev => ({ ...prev, error: null }))
    };
};

export default usePassaggiLavorazione;
