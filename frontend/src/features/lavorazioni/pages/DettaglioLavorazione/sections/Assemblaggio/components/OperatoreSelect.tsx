import React from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.$hasError ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

interface OperatoreSelectProps {
  id: string;
  value: string;
  operatori: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export const OperatoreSelect: React.FC<OperatoreSelectProps> = ({
  id,
  value,
  operatori,
  onChange,
  disabled = false,
  hasError = false
}) => {
  return (
    <SelectWrapper>
      <StyledSelect
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        $hasError={hasError}
      >
        <option value="">Seleziona operatore...</option>
        {operatori.map((operatore) => (
          <option key={operatore} value={operatore}>
            {operatore}
          </option>
        ))}
      </StyledSelect>
    </SelectWrapper>
  );
};
