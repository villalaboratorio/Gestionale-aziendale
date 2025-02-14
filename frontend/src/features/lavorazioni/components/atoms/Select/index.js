import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Label = styled.label`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledSelect = styled.select`
    padding: 8px;
    border: 1px solid ${({ theme, error }) => error ? theme.colors.error : theme.colors.border};
    border-radius: 4px;
    font-size: 14px;
    background: white;
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }
    
    &:disabled {
        background: ${({ theme }) => theme.colors.disabled};
        cursor: not-allowed;
    }
`;

const Select = ({
    label,
    value,
    onChange,
    options = [],
    error,
    disabled,
    placeholder = 'Seleziona...'
}) => {
    return (
        <SelectWrapper>
            {label && <Label>{label}</Label>}
            <StyledSelect
                value={value}
                onChange={onChange}
                error={error}
                disabled={disabled}
            >
                <option value="">{placeholder}</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect>
        </SelectWrapper>
    );
};

Select.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })),
    error: PropTypes.string,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string
};

export default Select;
