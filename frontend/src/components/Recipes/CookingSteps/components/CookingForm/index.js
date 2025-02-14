import React, { useState, useCallback } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useCookingOptions } from '../../hooks/useCookingOption';
import {
    FormContainer,
    FormGroup,
    Label,
    Select,
    Input,
    TextArea,
    ButtonGroup,
    Button,
    ErrorMessage,
    ValidationMessage,
    FormHeader,
    FormContent,
    FormFooter
} from './styles';

const CookingForm = ({ initialData, onSubmit, onCancel }) => {
    const { tipiCottura, loading, error: optionsError } = useCookingOptions();
    const [formData, setFormData] = useState(initialData || {
        tipoCottura: '',
        temperatura: '',
        tempo: '',
        descrizione: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.tipoCottura) {
            newErrors.tipoCottura = 'Seleziona un tipo di cottura';
        }
        if (!formData.temperatura) {
            newErrors.temperatura = 'Inserisci la temperatura';
        } else if (isNaN(formData.temperatura) || formData.temperatura < 0) {
            newErrors.temperatura = 'La temperatura deve essere un numero positivo';
        }
        if (formData.tempo && (isNaN(formData.tempo) || formData.tempo < 0)) {
            newErrors.tempo = 'Il tempo deve essere un numero positivo';
        }
        return newErrors;
    }, [formData]);

    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
        // Reset error for this field when user starts typing
        setErrors(prev => ({ ...prev, [name]: '' }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
    
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const formattedData = {
                    tipoCottura: formData.tipoCottura,
                    temperatura: Number(formData.temperatura),
                    tempo: Number(formData.tempo || 0),
                    descrizione: formData.descrizione || '',
                    ordine: initialData?.ordine || 0
                };
    
                await onSubmit(formattedData);
                setErrors({});
            } catch (error) {
                setErrors({ submit: error.message || 'Errore durante il salvataggio' });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(newErrors);
        }
    };
    
    

    if (loading) {
        return <ValidationMessage>Caricamento opzioni...</ValidationMessage>;
    }

    if (optionsError) {
        return <ErrorMessage>{optionsError}</ErrorMessage>;
    }

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormHeader>
                <h3>{initialData ? 'Modifica Cottura' : 'Nuova Cottura'}</h3>
            </FormHeader>

            <FormContent>
                <FormGroup>
                    <Label htmlFor="tipoCottura" required>Tipo Cottura</Label>
                    <Select
                        id="tipoCottura"
                        name="tipoCottura"
                        value={formData.tipoCottura}
                        onChange={handleChange}
                        error={errors.tipoCottura}
                        disabled={isSubmitting}
                    >
                        <option value="">Seleziona tipo</option>
                        {tipiCottura.map(tipo => (
                            <option key={tipo._id} value={tipo._id}>
                                {tipo.name}
                            </option>
                        ))}
                    </Select>
                    {errors.tipoCottura && (
                        <ValidationMessage error>{errors.tipoCottura}</ValidationMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="temperatura" required>Temperatura (°C)</Label>
                    <Input
                        id="temperatura"
                        name="temperatura"
                        type="number"
                        min="0"
                        value={formData.temperatura}
                        onChange={handleChange}
                        error={errors.temperatura}
                        disabled={isSubmitting}
                    />
                    {errors.temperatura && (
                        <ValidationMessage error>{errors.temperatura}</ValidationMessage>
                    )}
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
                        disabled={isSubmitting}
                    />
                    {errors.tempo && (
                        <ValidationMessage error>{errors.tempo}</ValidationMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="descrizione">Note</Label>
                    <TextArea
                        id="descrizione"
                        name="descrizione"
                        value={formData.descrizione}
                        onChange={handleChange}
                        rows={4}
                        disabled={isSubmitting}
                    />
                </FormGroup>
            </FormContent>

            <FormFooter>
                {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
                <ButtonGroup>
                    <Button 
                        type="submit" 
                        primary 
                        disabled={isSubmitting}
                    >
                        <FaSave /> {isSubmitting ? 'Salvataggio...' : 'Salva'}
                    </Button>
                    <Button 
                        type="button" 
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <FaTimes /> Annulla
                    </Button>
                </ButtonGroup>
            </FormFooter>
        </FormContainer>
    );
};

export default CookingForm;
