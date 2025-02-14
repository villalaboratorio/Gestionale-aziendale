import React, { useState, useCallback } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useFasiOptions } from '../../hooks/useFasiOptions';
import {
    FormContainer,
    FormGroup,
    Label,
    Select,
    Input,
    TextArea,
    ButtonGroup,
    Button,
    ErrorMessage
} from './styles';

const StepForm = ({ initialData, onSubmit, onCancel }) => {
    const { tipi, metodi, loading, error: optionsError } = useFasiOptions();
    const [formData, setFormData] = useState(initialData || {
        tipoLavorazione: '',
        metodo: '',
        tempo: '',
        descrizione: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.tipoLavorazione) newErrors.tipoLavorazione = 'Seleziona un tipo di lavorazione';
        if (!formData.metodo) newErrors.metodo = 'Seleziona un metodo';
        if (formData.tempo && (isNaN(formData.tempo) || formData.tempo < 0)) {
            newErrors.tempo = 'Il tempo deve essere un numero positivo';
        }
        return newErrors;
    }, [formData]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                await onSubmit({
                    ...formData,
                    tempo: formData.tempo ? parseInt(formData.tempo) : 0
                });
                setErrors({});
            } catch (error) {
                setErrors({ submit: error.message });
            }
        } else {
            setErrors(newErrors);
        }
    }, [formData, onSubmit, validateForm]);

    if (loading) {
        return <div>Caricamento opzioni...</div>;
    }

    if (optionsError) {
        return <ErrorMessage>{optionsError}</ErrorMessage>;
    }

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
                <Label htmlFor="tipoLavorazione">Tipo Lavorazione</Label>
                <Select
                    id="tipoLavorazione"
                    name="tipoLavorazione"
                    value={formData.tipoLavorazione}
                    onChange={handleChange}
                    error={errors.tipoLavorazione}
                >
                    <option value="">Seleziona tipo</option>
                    {tipi.map(tipo => (
                        <option key={tipo._id} value={tipo._id}>
                            {tipo.name}
                        </option>
                    ))}
                </Select>
                {errors.tipoLavorazione && (
                    <ErrorMessage>{errors.tipoLavorazione}</ErrorMessage>
                )}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="metodo">Metodo</Label>
                <Select
                    id="metodo"
                    name="metodo"
                    value={formData.metodo}
                    onChange={handleChange}
                    error={errors.metodo}
                >
                    <option value="">Seleziona metodo</option>
                    {metodi.map(metodo => (
                        <option key={metodo._id} value={metodo._id}>
                            {metodo.name}
                        </option>
                    ))}
                </Select>
                {errors.metodo && <ErrorMessage>{errors.metodo}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="tempo">Tempo (minuti)</Label>
                <Input
                    id="tempo"
                    name="tempo"
                    type="number"
                    min="0"
                    value={formData.tempo}
                    onChange={handleChange}
                    error={errors.tempo}
                />
                {errors.tempo && <ErrorMessage>{errors.tempo}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="descrizione">Descrizione</Label>
                <TextArea
                    id="descrizione"
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleChange}
                    rows={4}
                />
            </FormGroup>

            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

            <ButtonGroup>
                <Button type="submit" primary>
                    <FaSave /> Salva
                </Button>
                <Button type="button" onClick={onCancel}>
                    <FaTimes /> Annulla
                </Button>
            </ButtonGroup>
        </FormContainer>
    );
};

export default StepForm;
