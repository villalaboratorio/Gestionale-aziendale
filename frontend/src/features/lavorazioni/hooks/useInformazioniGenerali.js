import { useCallback,  } from 'react';
import useInformazioniGeneraliData from './useInformazioniGeneraliData';
import useInformazioniGeneraliForm from './useInformazioniGeneraliForm';
import useInformazioniGeneraliSave from './useInformazioniGeneraliSave';

const useInformazioniGenerali = ({ initialData = {}, collections = {} }) => {
    // Gestione dei dati e dello stato
    const {
        localData,
        collections: normalizedCollections,
        isDirty,
        handleFormChange,
        handleReset,
        setLocalData,
        setIsDirty
    } = useInformazioniGeneraliData({
        data: initialData,
        collections
    });

    // Gestione del salvataggio
    const {
        saving,
        saveError,
        lastSaved,
        handleSave,
        handleDelete,
        saveLavorazione
    } = useInformazioniGeneraliSave({
        localData,
        setIsDirty
    });

    // Gestione del form e dei campi
    const {
        formFields,
        renderField,
        renderFormSection,
        formSections
    } = useInformazioniGeneraliForm({
        handleFormChange,
        localData,
        collections: normalizedCollections,
        loading: saving
    });

    // Validazione del form
    const validateForm = useCallback(() => {
        const requiredFields = ['cliente', 'ricetta', 'tipoLavorazione', 'dataLavorazione'];
        const errors = {};

        requiredFields.forEach(field => {
            if (!localData[field]) {
                errors[field] = 'Campo obbligatorio';
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }, [localData]);

    // Gestione del submit
    const handleSubmit = useCallback(async () => {
        const { isValid, errors } = validateForm();
        if (!isValid) {
            return { success: false, errors };
        }

        try {
            const result = await handleSave();
            setIsDirty(false);
            setLocalData(result.data); // Aggiorna i dati locali con la risposta del server
            return { success: true, data: result.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, [validateForm, handleSave, setIsDirty, setLocalData]);

    return {
        // Dati e stato
        data: localData,
        collections: normalizedCollections,
        isDirty,
        loading: saving,
        error: saveError,
        lastSaved,

        // Azioni del form
        handleFormChange,
        handleReset,
        handleSubmit,
        validateForm,

        // Azioni CRUD
        handleSave,
        handleDelete,
        saveLavorazione,

        // Campi del form
        formFields,
        renderField,
        renderFormSection,
        formSections,

        // Setters
        setLocalData,
        setIsDirty
    };
};

export default useInformazioniGenerali;
