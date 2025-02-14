// useInformazioniGeneraliStyles.js
import styled from 'styled-components';

export const Wrapper = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme }) => theme.shadows.small};
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    grid-column: span ${({ span }) => span || 12};
`;

export const Label = styled.label`
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    
    ${({ required }) => required && `
        &::after {
            content: ' *';
            color: ${({ theme }) => theme.colors.danger};
        }
    `}
`;

export const Input = styled.input`
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;

export const Select = styled.select`
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: all 0.2s;
    background-color: white;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
`;
export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger || '#ef4444'};
    font-size: ${({ theme }) => theme.typography.fontSize.sm || '0.875rem'};
    padding: ${({ theme }) => theme.spacing.sm || '0.5rem'};
    margin-top: ${({ theme }) => theme.spacing.md || '1rem'};
    background: ${({ theme }) => theme.colors.dangerLight || '#fee2e2'};
    border-radius: ${({ theme }) => theme.borderRadius.sm || '0.25rem'};
    border-left: 4px solid ${({ theme }) => theme.colors.danger || '#ef4444'};
`;

export const TextArea = styled(Input).attrs({ as: 'textarea' })`
    min-height: 100px;
    resize: vertical;
`;

export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0;
`;

export const Description = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

export const ActionBar = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Button = styled.button`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    border-radius: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    transition: all 0.2s;
    
    background: ${({ theme, variant }) => 
        variant === 'secondary' ? 'white' : theme.colors.primary};
    color: ${({ theme, variant }) => 
        variant === 'secondary' ? theme.colors.text.primary : 'white'};
    border: 1px solid ${({ theme, variant }) => 
        variant === 'secondary' ? theme.colors.border : theme.colors.primary};

    &:hover:not(:disabled) {
        background: ${({ theme, variant }) => 
            variant === 'secondary' ? theme.colors.background : theme.colors.primary};
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export default {
    Wrapper,
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Select,
    TextArea,
    Row,
    Title,
    Description,
    ActionBar,
    ErrorMessage,
    Button
};
