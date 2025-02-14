import styled from 'styled-components';

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing.lg};
`;

export const FormHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    h3 {
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    }
`;

export const FormContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

    ${({ required }) => required && `
        &::after {
            content: '*';
            color: ${({ theme }) => theme.colors.danger};
            margin-left: 4px;
        }
    `}
`;

export const Select = styled.select`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ error, theme }) => 
        error ? theme.colors.danger : theme.colors.border};
    border-radius: 4px;
    height: 48px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    background-color: ${({ theme }) => theme.colors.white};
    
    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;

export const Input = styled.input`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ error, theme }) => 
        error ? theme.colors.danger : theme.colors.border};
    border-radius: 4px;
    height: 48px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    
    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;

export const TextArea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ error, theme }) => 
        error ? theme.colors.danger : theme.colors.border};
    border-radius: 4px;
    min-height: 100px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    resize: vertical;
    
    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;

export const FormFooter = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const Button = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: none;
    border-radius: 4px;
    background: ${({ primary, theme }) => 
        primary ? theme.colors.primary : theme.colors.secondary};
    color: white;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        opacity: 0.9;
    }
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.danger}15;
    border-radius: 4px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const ValidationMessage = styled.span`
    color: ${({ error, theme }) => 
        error ? theme.colors.danger : theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
