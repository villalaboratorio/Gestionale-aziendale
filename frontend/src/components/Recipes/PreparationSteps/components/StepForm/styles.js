import styled from 'styled-components';

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Select = styled.select`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme, error }) => error ? theme.colors.danger : theme.colors.border};
    border-radius: 4px;
    background: white;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
    }
`;

export const Input = styled.input`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme, error }) => error ? theme.colors.danger : theme.colors.border};
    border-radius: 4px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
    }
`;

export const TextArea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme, error }) => error ? theme.colors.danger : theme.colors.border};
    border-radius: 4px;
    resize: vertical;
    min-height: 100px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
    justify-content: flex-end;
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: none;
    border-radius: 4px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    cursor: pointer;
    transition: all 0.2s ease;
    
    background: ${({ theme, primary }) => primary ? theme.colors.primary : theme.colors.background};
    color: ${({ theme, primary }) => primary ? 'white' : theme.colors.text.primary};
    border: 1px solid ${({ theme, primary }) => primary ? 'transparent' : theme.colors.border};

    &:hover {
        background: ${({ theme, primary }) => primary ? theme.colors.primary + 'e6' : theme.colors.background + 'e6'};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.xs};
    background: ${({ theme }) => theme.colors.danger}10;
    border-radius: 4px;
`;
