// components/atoms/Button/index.js
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const BaseButton = styled.button`
    // Stili di base
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: 8px;
    border: none;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: all 0.2s ease;
    gap: ${({ theme }) => theme.spacing.sm};

    // Gestione disabled
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    // Varianti di stile usando transient props ($)
    ${props => {
        switch (props.$variant) {
            case 'primary':
                return css`
                    background: ${props.theme.colors.primary};
                    color: white;
                    &:hover:not(:disabled) {
                        background: ${props.theme.colors.primary}dd;
                        transform: translateY(-1px);
                    }
                `;
            case 'secondary':
                return css`
                    background: ${props.theme.colors.secondary};
                    color: white;
                    &:hover:not(:disabled) {
                        background: ${props.theme.colors.secondary}dd;
                        transform: translateY(-1px);
                    }
                `;
            case 'outline':
                return css`
                    background: transparent;
                    border: 1px solid ${props.theme.colors.primary};
                    color: ${props.theme.colors.primary};
                    &:hover:not(:disabled) {
                        background: ${props.theme.colors.primary}11;
                    }
                `;
            case 'text':
                return css`
                    background: transparent;
                    color: ${props.theme.colors.primary};
                    padding: ${props.theme.spacing.xs};
                    &:hover:not(:disabled) {
                        background: ${props.theme.colors.primary}11;
                    }
                `;
            default:
                return '';
        }
    }}

    // Gestione dimensioni
    ${props => {
        switch (props.$size) {
            case 'small':
                return css`
                    padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
                    font-size: ${props.theme.typography.fontSize.sm};
                `;
            case 'large':
                return css`
                    padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
                    font-size: ${props.theme.typography.fontSize.lg};
                `;
            default:
                return '';
        }
    }}
`;

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'medium',
    disabled = false,
    onClick,
    type = 'button',
    className,
    ...props 
}) => {
    return (
        <BaseButton
            $variant={variant}
            $size={size}
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={className}
            {...props}
        >
            {children}
        </BaseButton>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string
};

export default Button;
