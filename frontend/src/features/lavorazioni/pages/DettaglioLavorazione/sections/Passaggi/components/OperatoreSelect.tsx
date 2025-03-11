import React from 'react';
import { QuantityType } from '../../../../../types/models.types';

interface OperatoreSelectProps {
  value: string;
  onChange: (value: string) => void;
  operatori: QuantityType[];
  disabled?: boolean;
}

const OperatoreSelect: React.FC<OperatoreSelectProps> = ({
  value,
  onChange,
  operatori,
  disabled = false
}) => {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">Seleziona operatore...</option>
      {operatori.map(op => (
        <option key={op._id} value={op.name}>
          {op.name}
        </option>
      ))}
    </select>
  );
};

export default OperatoreSelect;
