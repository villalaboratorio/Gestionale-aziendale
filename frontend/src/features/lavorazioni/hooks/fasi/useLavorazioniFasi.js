import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { lavorazioniAPI } from '../../services/api';

const useLavorazioneFasi = (lavorazioneId) => {
    const startFase = useCallback(async (fase) => {
        try {
            const result = await lavorazioniAPI.startFase(lavorazioneId, fase);
            toast.success(`Fase ${fase} avviata`);
            return result;
        } catch (error) {
            toast.error(`Errore nell'avvio della fase ${fase}`);
            throw error;
        }
    }, [lavorazioneId]);

    const completeFase = useCallback(async (fase) => {
        try {
            const result = await lavorazioniAPI.completeFase(lavorazioneId, fase);
            toast.success(`Fase ${fase} completata`);
            return result;
        } catch (error) {
            toast.error(`Errore nel completamento della fase ${fase}`);
            throw error;
        }
    }, [lavorazioneId]);

    return {
        startFase,
        completeFase
    };
};

export default useLavorazioneFasi;
