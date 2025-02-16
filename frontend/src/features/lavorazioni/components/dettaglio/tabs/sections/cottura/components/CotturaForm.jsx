import React, { useState } from 'react';
import { Input, Select, Button } from '../../../../../atoms';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const CotturaForm = ({ ricetta, onSave, onCancel, tipiCottura = [] }) => {
  const [formData, setFormData] = useState({
    tipoCottura: '',
    temperaturaTarget: ricetta?.cotture?.[0]?.temperatura || '',
    tempoCottura: ricetta?.cotture?.[0]?.tempoCottura || '',
    addetto: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tipoCottura) {
      newErrors.tipoCottura = 'Seleziona un tipo di cottura';
    }
    if (!formData.temperaturaTarget) {
      newErrors.temperaturaTarget = 'Inserisci la temperatura target';
    }
    if (!formData.tempoCottura) {
      newErrors.tempoCottura = 'Inserisci il tempo di cottura';
    }
    if (!formData.addetto) {
      newErrors.addetto = 'Inserisci l\'operatore';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        temperaturaTarget: Number(formData.temperaturaTarget),
        tempoCottura: Number(formData.tempoCottura)
      });
      setFormData({
        tipoCottura: '',
        temperaturaTarget: '',
        tempoCottura: '',
        addetto: ''
      });
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <GridLayout>
        <FormField>
          <Select
            label="Tipo Cottura"
            value={formData.tipoCottura}
            onChange={(e) => handleChange('tipoCottura', e.target.value)}
            error={errors.tipoCottura}
            options={[
              { value: '', label: 'Seleziona tipo cottura' },
              ...tipiCottura
            ]}
          />
        </FormField>

        <FormField>
          <Input
            type="number"
            label="Temperatura Target (°C)"
            value={formData.temperaturaTarget}
            onChange={(e) => handleChange('temperaturaTarget', e.target.value)}
            error={errors.temperaturaTarget}
            min={0}
            max={500}
          />
        </FormField>

        <FormField>
          <Input
            type="number"
            label="Tempo Cottura (minuti)"
            value={formData.tempoCottura}
            onChange={(e) => handleChange('tempoCottura', e.target.value)}
            error={errors.tempoCottura}
            min={0}
          />
        </FormField>

        <FormField>
          <Input
            type="text"
            label="Operatore"
            value={formData.addetto}
            onChange={(e) => handleChange('addetto', e.target.value)}
            error={errors.addetto}
          />
        </FormField>
      </GridLayout>

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit">
          Aggiungi Cottura
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default React.memo(CotturaForm);