import React, { useState, useCallback } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Button } from '../../../../../components/common';
import {
    FormContainer,
    FormGroup,
    Label,
    Select,
    Input,
    ButtonGroup,
    ErrorMessage
} from './styles';

const IngredientForm = ({ availableIngredients, units, onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        ingrediente: '',
        quantita: '',
        unitaMisura: '',
        caloPeso: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formData.ingrediente) newErrors.ingrediente = 'Seleziona un ingrediente';
        if (!formData.quantita) newErrors.quantita = 'Inserisci una quantità';
        if (!formData.unitaMisura) newErrors.unitaMisura = 'Seleziona un\'unità di misura';
        if (formData.caloPeso && (formData.caloPeso < 0 || formData.caloPeso > 100)) {
            newErrors.caloPeso = 'Il calo peso deve essere tra 0 e 100';
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
        console.log('Form Submit - Dati:', {
            ingrediente: formData.ingrediente,
            tipo: typeof formData.ingrediente
      
        
    }); 
        const newErrors = validateForm();
        
        if (Object.keys(newErrors).length === 0) {
            try {
                await onSave({
                    ...formData,
                    quantita: parseFloat(formData.quantita),
                    caloPeso: formData.caloPeso ? parseFloat(formData.caloPeso) : 0
                });
                setErrors({});
            } catch (error) {
                setErrors({ submit: error.message });
            }
        } else {
            setErrors(newErrors);
        }
    }, [formData, onSave, validateForm]);

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
                <Label htmlFor="ingrediente">Ingrediente</Label>
                <Select
    id="ingrediente"
    name="ingrediente"
    value={formData.ingrediente}
    onChange={(e) => {
        console.group('Selezione Ingrediente');
        console.log('Valore selezionato:', e.target.value);
        console.log('Ingrediente completo:', availableIngredients.find(ing => ing._id === e.target.value));
        console.log('Stato form prima del cambio:', formData);
        handleChange(e);
        console.log('Stato form dopo il cambio:', formData);
        console.groupEnd();
    }}
    error={errors.ingrediente}
>
    <option value="">Seleziona ingrediente</option>
    {availableIngredients.map(ing => {
        console.log('Opzione disponibile:', ing);
        return (
            <option key={ing._id} value={ing._id}>
                {ing.name}
            </option>
        );
    })}
</Select>

                {errors.ingrediente && <ErrorMessage>{errors.ingrediente}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="quantita">Quantità</Label>
                <Input
                    id="quantita"
                    name="quantita"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantita}
                    onChange={handleChange}
                    error={errors.quantita}
                />
                {errors.quantita && <ErrorMessage>{errors.quantita}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="unitaMisura">Unità di Misura</Label>
                <Select
                    id="unitaMisura"
                    name="unitaMisura"
                    value={formData.unitaMisura}
                    onChange={handleChange}
                    error={errors.unitaMisura}
                >
                    <option value="">Seleziona unità</option>
                    {units.map(unit => (
                        <option key={unit._id} value={unit._id}>
                            {unit.name} ({unit.abbreviation})
                        </option>
                    ))}
                </Select>
                {errors.unitaMisura && <ErrorMessage>{errors.unitaMisura}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
                <Label htmlFor="caloPeso">Calo Peso (%)</Label>
                <Input
                    id="caloPeso"
                    name="caloPeso"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.caloPeso}
                    onChange={handleChange}
                    error={errors.caloPeso}
                />
                {errors.caloPeso && <ErrorMessage>{errors.caloPeso}</ErrorMessage>}
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

export default IngredientForm;
