import React from 'react';
import styled from 'styled-components';
import theme from '../../../styles/theme';

const StyledSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.md};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background-color: ${theme.colors.surface};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }

  &:disabled {
    background-color: ${theme.colors.background};
    cursor: not-allowed;
  }

  option {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
  }
`;

interface Option {
  value: string | number;
  label: string;
}

interface SelectWrapProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Option[];
}

const SelectWrap: React.FC<SelectWrapProps> = ({ options, children, ...rest }) => {
  return (
    <StyledSelect {...rest}>
      {options ? 
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
        : children
      }
    </StyledSelect>
  );
};

export default SelectWrap;
