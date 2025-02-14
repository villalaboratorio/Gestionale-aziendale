import { useState } from 'react';

export const useStepForm = (initialData) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (data) => {
        const newErrors = {};
        
        if (!data.tipoLavorazione) {
            newErrors.tipoLavorazione = 'Campo obbligatorio';
        }
        if (!data.metodo) {
            newErrors.metodo = 'Campo obbligatorio';
        }
        if (data.tempo && (isNaN(data.tempo) || data.tempo < 0)) {
            newErrors.tempo = 'Inserire un numero valido';
        }

        return newErrors;
    };

    const handleSubmit = async (onSubmit) => {
        try {
            setIsSubmitting(true);
            const validationErrors = validateForm(formData);
            
            if (Object.keys(validationErrors).length === 0) {
                await onSubmit(formData);
                return true;
            } else {
                setErrors(validationErrors);
                return false;
            }
        } catch (error) {
            setErrors({ submit: error.message });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        errors,
        isSubmitting,
        handleSubmit
    };
};
