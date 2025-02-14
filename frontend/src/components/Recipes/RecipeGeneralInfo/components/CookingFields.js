import React from 'react';
import styled from 'styled-components';
import { FaTemperatureHigh, FaClock, FaInfo } from 'react-icons/fa';

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const CookingRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  align-items: start;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
`;

const CookingFields = ({ editedRecipe, isEditing, onChange }) => {
  return (
    <FieldsContainer>
      <CookingRow>
        <FieldGroup>
          <Label>Tipo Cottura</Label>
          <Select
            value={editedRecipe?.tipoCottura || ''}
            onChange={(e) => onChange('tipoCottura', e.target.value)}
            disabled={!isEditing}
          >
            <option value="">Seleziona tipo cottura</option>
            <option value="forno">Forno</option>
            <option value="fornello">Fornello</option>
            <option value="vapore">Vapore</option>
            <option value="sottovuoto">Sottovuoto</option>
            <option value="microonde">Microonde</option>
          </Select>
        </FieldGroup>

        <FieldGroup>
          <Label><FaClock /> Tempo (min)</Label>
          <Input
            type="number"
            value={editedRecipe?.tempoCottura || ''}
            onChange={(e) => onChange('tempoCottura', e.target.value)}
            disabled={!isEditing}
            min="0"
          />
        </FieldGroup>

        <FieldGroup>
          <Label><FaTemperatureHigh /> Gradi (°C)</Label>
          <Input
            type="number"
            value={editedRecipe?.temperatura || ''}
            onChange={(e) => onChange('temperatura', e.target.value)}
            disabled={!isEditing}
            min="0"
          />
        </FieldGroup>
      </CookingRow>

      <FieldGroup>
        <Label><FaInfo /> Note Cottura</Label>
        <TextArea
          value={editedRecipe?.noteCottura || ''}
          onChange={(e) => onChange('noteCottura', e.target.value)}
          disabled={!isEditing}
          placeholder="Inserisci note sulla cottura..."
        />
      </FieldGroup>
    </FieldsContainer>
  );
};

export default CookingFields;
