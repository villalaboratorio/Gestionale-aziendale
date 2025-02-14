import styled from 'styled-components';

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: ${({ theme }) => theme.spacing.lg};
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
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    background: white;
    
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

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.colors.danger};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;
