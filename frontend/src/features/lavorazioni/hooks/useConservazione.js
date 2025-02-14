import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const useConservazione = (lavorazione, onUpdate) => {
    const [conservazione, setConservazione] = useState({
        dati: null,
        loading: false,
        error: null,
        verifiche: [],
        scadenza: null
    });

    const handleApiCall = useCallback(async (apiCall, successCallback) => {
        setConservazione(prev => ({ ...prev, loading: true }));
        try {
            const response = await apiCall();
            const updatedData = successCallback(response.data);
            
            // Update local state
            setConservazione(prev => ({
                ...prev,
                ...updatedData,
                error: null,
                loading: false
            }));

            // Notify parent through callback
            onUpdate('conservazione', updatedData);
            
            return response.data;
        } catch (error) {
            setConservazione(prev => ({ 
                ...prev, 
                error: error.message,
                loading: false 
            }));
            toast.error(`Errore: ${error.message}`);
            throw error;
        }
    }, [onUpdate]);

    const updateImballaggio = useCallback((datiImballaggio) => {
        if (!lavorazione?.id) return;
        
        return handleApiCall(
            () => axios.put(
                `/api/dettaglio-lavorazioni/${lavorazione.id}/conservazione/imballaggio`,
                datiImballaggio
            ),
            (data) => ({ 
                dati: { 
                    ...conservazione.dati, 
                    imballaggio: data 
                }
            })
        );
    }, [lavorazione?.id, handleApiCall, conservazione.dati]);

    const updateMetodoConservazione = useCallback((metodo) => {
        if (!lavorazione?.id) return;
        return handleApiCall(
            () => axios.put(
                `/api/dettaglio-lavorazioni/${lavorazione.id}/conservazione/metodo`,
                metodo
            ),
            (data) => ({ 
                dati: { 
                    ...conservazione.dati, 
                    metodo: data 
                }
            })
        );
    }, [lavorazione?.id, handleApiCall, conservazione.dati]);

    const registraVerifica = useCallback((datiVerifica) => {
        if (!lavorazione?.id) return;
        return handleApiCall(
            () => axios.post(
                `/api/dettaglio-lavorazioni/${lavorazione.id}/conservazione/verifica`,
                datiVerifica
            ),
            (data) => ({ 
                verifiche: [...conservazione.verifiche, data]
            })
        );
    }, [lavorazione?.id, handleApiCall, conservazione.verifiche]);

    const calcolaScadenza = useCallback(() => {
        if (!lavorazione?.id) return;
        return handleApiCall(
            () => axios.get(
                `/api/dettaglio-lavorazioni/${lavorazione.id}/conservazione/scadenza`
            ),
            (data) => ({ scadenza: data })
        );
    }, [lavorazione?.id, handleApiCall]);

    return {
        ...conservazione,
        updateImballaggio,
        updateMetodoConservazione,
        registraVerifica,
        calcolaScadenza
    };
};

export default useConservazione;
