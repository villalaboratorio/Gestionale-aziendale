import React, { useState, useEffect, useMemo } from 'react';
import { Input, Select, Button } from '../../../../../atoms';
import styled from 'styled-components';

const ParametriContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px 8px 0 0;
`;

const ParametriTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2em;
`;

const ParametriGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ParametroField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const OriginalValue = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.8em;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: flex-end;
`;

const CotturaParameters = ({
  cottura,
  ricetta,
  tipiCottura,
  onUpdate,
  isEditing = false
}) => {
  const [editing, setEditing] = useState(isEditing);
  const [parametri, setParametri] = useState({
    tipoCottura: cottura?.tipoCottura || '',
    temperaturaTarget: cottura?.temperaturaTarget || '',
    tempoCottura: cottura?.tempoCottura || '',
    addetto: cottura?.addetto || ''
  });
  const [errors, setErrors] = useState({});

  const handleStartEdit = () => setEditing(true);
  const handleCancelEdit = () => setEditing(false);
  const handleSaveEdit = () => {
    onUpdate(cottura._id, parametri);
    setEditing(false);
  };

  const originalValues = useMemo(() => ({
    tipoCottura: ricetta?.cotture?.[0]?.tipoCottura,
    temperaturaTarget: ricetta?.cotture?.[0]?.temperatura,
    tempoCottura: ricetta?.cotture?.[0]?.tempoCottura
  }), [ricetta]);

  useEffect(() => {
    if (ricetta?.cotture?.[0]) {
      setParametri(prev => ({
        ...prev,
        tipoCottura: cottura?.tipoCottura || ricetta.cotture[0].tipoCottura,
        temperaturaTarget: cottura?.temperaturaTarget || ricetta.cotture[0].temperatura,
        tempoCottura: cottura?.tempoCottura || ricetta.cotture[0].tempoCottura
      }));
    }
  }, [ricetta, cottura]);

  const validateField = (name, value) => {
    switch (name) {
      case 'tipoCottura':
        return !value ? 'Tipo cottura richiesto' : '';
      case 'temperaturaTarget':
        return !value ? 'Temperatura richiesta' :
               value < 0 ? 'Temperatura non valida' :
               value > 500 ? 'Temperatura massima 500°C' : '';
      case 'tempoCottura':
        return !value ? 'Tempo cottura richiesto' :
               value <= 0 ? 'Tempo non valido' : '';
      case 'addetto':
        return !value ? 'Operatore richiesto' : '';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    const newValue = field.includes('temperatura') || field.includes('tempo') 
      ? Number(value) 
      : value;

    setParametri(prev => ({
      ...prev,
      [field]: newValue
    }));

    if (!error) {
      onUpdate?.(cottura._id, { [field]: newValue });
    }
  };

  const isValueChanged = (field) => {
    return parametri[field] !== originalValues[field] && originalValues[field] !== undefined;
  };

  return (
    <ParametriContainer>
      <ParametriTitle>
        Parametri Cottura
        {!editing && (
          <Button onClick={handleStartEdit}>Modifica</Button>
        )}
      </ParametriTitle>
      
      <ParametriGrid>
        <ParametroField>
          <FieldLabel htmlFor="tipoCottura">Tipo di Cottura</FieldLabel>
          <Select
            id="tipoCottura"
            value={parametri.tipoCottura}
            onChange={(e) => handleChange('tipoCottura', e.target.value)}
            error={errors.tipoCottura}
            options={tipiCottura}
          />
{errors.tipoCottura && <ErrorMessage>{errors.tipoCottura}</ErrorMessage>}
{isValueChanged('tipoCottura') && (
  <OriginalValue>
    Originale: {tipiCottura.find(t => t._id === originalValues.tipoCottura)?.name || ''}
  </OriginalValue>
)}

        </ParametroField>

        <ParametroField>
          <FieldLabel htmlFor="temperaturaTarget">Temperatura Target (°C)</FieldLabel>
          <Input
            id="temperaturaTarget"
            type="number"
            value={parametri.temperaturaTarget}
            onChange={(e) => handleChange('temperaturaTarget', e.target.value)}
            error={errors.temperaturaTarget}
            min={0}
            max={500}
          />
          {errors.temperaturaTarget && <ErrorMessage>{errors.temperaturaTarget}</ErrorMessage>}
          {isValueChanged('temperaturaTarget') && (
            <OriginalValue>
              Originale: {originalValues.temperaturaTarget}°C
            </OriginalValue>
          )}
        </ParametroField>

        <ParametroField>
          <FieldLabel htmlFor="tempoCottura">Tempo di Cottura (minuti)</FieldLabel>
          <Input
            id="tempoCottura"
            type="number"
            value={parametri.tempoCottura}
            onChange={(e) => handleChange('tempoCottura', e.target.value)}
            error={errors.tempoCottura}
            min={1}
          />
          {errors.tempoCottura && <ErrorMessage>{errors.tempoCottura}</ErrorMessage>}
          {isValueChanged('tempoCottura') && (
            <OriginalValue>
              Originale: {originalValues.tempoCottura} min
            </OriginalValue>
          )}
        </ParametroField>

        <ParametroField>
          <FieldLabel htmlFor="addetto">Operatore</FieldLabel>
          <Input
            id="addetto"
            type="text"
            value={parametri.addetto}
            onChange={(e) => handleChange('addetto', e.target.value)}
            error={errors.addetto}
          />
          {errors.addetto && <ErrorMessage>{errors.addetto}</ErrorMessage>}
        </ParametroField>
      </ParametriGrid>

      {editing && (
        <ButtonGroup>
          <Button variant="secondary" onClick={handleCancelEdit}>Annulla</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Salva</Button>
        </ButtonGroup>
      )}
    </ParametriContainer>
  );
};
export default React.memo(CotturaParameters);
