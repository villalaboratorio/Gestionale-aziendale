import React, { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import {
    FormContainer,
    FormGrid,
    FormField,
    ErrorMessage
} from '../../../pages/@DettaglioLavorazione.styles';

const LavorazioneForm = ({ data, collections, onChange, loading, errors = {} }) => {
    const formFields = useMemo(() => {
        console.group('🔄 Form Fields Initialization');
        console.log('Current Data:', data);
        console.log('Available Collections:', collections);

        const handleFieldChange = (field, value) => {
            const selectedItem = collections[field].find(item => item._id === value);
            onChange({
                ...data,
                [field]: selectedItem
            });
        };

        return {
            clienteField: {
                id: 'cliente',
                label: 'Cliente *',
                value: data?.cliente?._id || '',
                options: collections?.clienti || [],
                onChange: value => handleFieldChange('clienti', value)
            },
            ricettaField: {
                id: 'ricetta',
                label: 'Ricetta *',
                value: data?.ricetta?._id || '',
                options: collections?.ricette || [],
                onChange: value => handleFieldChange('ricette', value)
            },
            tipoLavorazioneField: {
                id: 'tipoLavorazione',
                label: 'Tipo Lavorazione *',
                value: data?.tipoLavorazione?._id || '',
                options: collections?.tipiLavorazione || [],
                onChange: value => handleFieldChange('tipiLavorazione', value)
            }
        };
    }, [data, collections, onChange]);

    return (
        <FormContainer>
            <FormGrid>
                <FormField>
                    <Form.Label>{formFields.clienteField.label}</Form.Label>
                    <Form.Select
                        value={formFields.clienteField.value}
                        onChange={(e) => formFields.clienteField.onChange(e.target.value)}
                        disabled={loading}
                        isInvalid={!!errors.cliente}
                    >
                        <option value="">Seleziona cliente</option>
                        {formFields.clienteField.options.map(cliente => (
                            <option key={cliente._id} value={cliente._id}>
                                {cliente.nome}
                            </option>
                        ))}
                    </Form.Select>
                    {errors.cliente && <ErrorMessage>{errors.cliente}</ErrorMessage>}
                </FormField>

                {/* Ripeti la stessa struttura per ricetta e tipoLavorazione */}
            </FormGrid>
        </FormContainer>
    );
};
export default LavorazioneForm;
