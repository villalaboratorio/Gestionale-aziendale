import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
    width: 100%;
    height: 38px;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    text-align: right;
    display: block;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
        opacity: 0.7;
    }

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
`;

const NumberField = ({ 
    value, 
    onChange, 
    min, 
    max, 
    step = "0.01", 
    disabled = false,
    required = false,
    placeholder,
    ...props 
}) => {
    const handleChange = (e) => {
        const newValue = e.target.value;
        
        if (newValue === '' || newValue === '-') {
            onChange(newValue);
            return;
        }

        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
            if (min !== undefined && numValue < min) return;
            if (max !== undefined && numValue > max) return;
            onChange(numValue);
        }
    };

    return (
        <StyledInput
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            {...props}
        />
    );
};

export default NumberField;
