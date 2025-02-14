import { useMemo } from 'react';
import { useStore } from '../../../store/lavorazioneStore';

const useIngredientiHaccpForm = () => {
    const { lavorazione, getVerificheHaccpStats } = useStore();
    const verifiche = lavorazione?.verificheHaccp || {};

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        Object.entries(verifiche).forEach(([ingredienteId, verifica]) => {
            errors[ingredienteId] = {};
            
            // Validazione TMC
            if (!verifica.tmc) {
                errors[ingredienteId].tmc = 'TMC obbligatorio';
                isValid = false;
            }

            // Validazione Lotto
            if (!verifica.lotto) {
                errors[ingredienteId].lotto = 'Lotto obbligatorio';
                isValid = false;
            }
        });

        return { isValid, errors };
    };

    const stats = useMemo(() => getVerificheHaccpStats(), [getVerificheHaccpStats]);

    return {
        validateForm,
        isDirty: Object.values(verifiche).length > 0,
        stats
    };
};

export default useIngredientiHaccpForm;
