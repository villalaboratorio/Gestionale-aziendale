import React, { useState, useEffect, useMemo } from 'react';
import { Input, Select, Button } from '../../../../../atoms';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2em;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.8em;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const CotturaForm = ({ ricetta, tipiCottura = [], onSave }) => {
  const defaultValues = useMemo(() => {
    const cottura = ricetta?.cotture?.[0];
    return {
      tipoCottura: cottura?.tipoCottura || '',
      temperaturaTarget: cottura?.temperatura || '',
      tempoCottura: cottura?.tempoCottura || '',
      addetto: ''
    };
  }, [ricetta]);

  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const cottura = ricetta?.cotture?.[0];
    if (cottura) {
      setFormData({
        tipoCottura: cottura.tipoCottura || '',
        temperaturaTarget: cottura.temperatura || '',
        tempoCottura: cottura.tempoCottura || '',
        addetto: ''
      });
      setErrors({});
    }
  }, [ricetta]);

  const validateField = (name, value) => {
    switch (name) {
      case 'tipoCottura':
        return !value ? 'Seleziona un tipo di cottura' : '';
      case 'temperaturaTarget': {
        const temp = Number(value);
        return !value ? 'Inserisci la temperatura target' : 
               temp < 0 ? 'La temperatura non può essere negativa' :
               temp > 500 ? 'La temperatura non può superare i 500°C' : '';
      }
      case 'tempoCottura': {
        const time = Number(value);
        return !value ? 'Inserisci il tempo di cottura' :
               time <= 0 ? 'Il tempo deve essere maggiore di 0' : '';
      }
      case 'addetto':
        return !value?.trim() ? 'Inserisci il nome dell\'operatore' : '';
      default:
        return '';
    }
  };
  const validateFormData = (data) => {
    const newErrors = {};
    Object.keys(data).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleChange = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateFormData(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      temperaturaTarget: Number(formData.temperaturaTarget),
      tempoCottura: Number(formData.tempoCottura),
      stato: 'non_iniziata'
    });

    setFormData(defaultValues);
    setErrors({});
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Nuova Cottura</FormTitle>
      
      <GridLayout>
        <FormField>
          <FieldLabel htmlFor="tipoCottura">Tipo di Cottura</FieldLabel>
          <Select
            id="tipoCottura"
            value={formData.tipoCottura}
            onChange={(e) => handleChange('tipoCottura', e.target.value)}
          >
            <option value="">Seleziona tipo cottura</option>
            {tipiCottura.map(tipo => (
              <option key={tipo._id} value={tipo._id}>
                {tipo.name}
              </option>
            ))}
          </Select>
          {errors.tipoCottura && <ErrorMessage>{errors.tipoCottura}</ErrorMessage>}
        </FormField>
        <FormField>
          <FieldLabel htmlFor="temperaturaTarget">Temperatura Target (°C)</FieldLabel>
          <Input
            id="temperaturaTarget"
            type="number"
            value={formData.temperaturaTarget}
            onChange={(e) => handleChange('temperaturaTarget', e.target.value)}
            error={errors.temperaturaTarget}
            min={0}
            max={500}
            placeholder="Es. 180"
          />
          {errors.temperaturaTarget && <ErrorMessage>{errors.temperaturaTarget}</ErrorMessage>}
        </FormField>

        <FormField>
          <FieldLabel htmlFor="tempoCottura">Tempo di Cottura (minuti)</FieldLabel>
          <Input
            id="tempoCottura"
            type="number"
            value={formData.tempoCottura}
            onChange={(e) => handleChange('tempoCottura', e.target.value)}
            error={errors.tempoCottura}
            min={1}
            placeholder="Es. 30"
          />
          {errors.tempoCottura && <ErrorMessage>{errors.tempoCottura}</ErrorMessage>}
        </FormField>

        <FormField>
          <FieldLabel htmlFor="addetto">Operatore</FieldLabel>
          <Input
            id="addetto"
            type="text"
            value={formData.addetto}
            onChange={(e) => handleChange('addetto', e.target.value)}
            error={errors.addetto}
            placeholder="Nome operatore"
          />
          {errors.addetto && <ErrorMessage>{errors.addetto}</ErrorMessage>}
        </FormField>
      </GridLayout>

      <ButtonGroup>
        <Button type="submit">Aggiungi Cottura</Button>
      </ButtonGroup>
    </FormContainer>
  );
};
export default React.memo(CotturaForm);
