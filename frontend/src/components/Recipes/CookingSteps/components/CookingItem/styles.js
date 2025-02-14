import styled from 'styled-components';

export const StepContainer = styled.div`
    position: relative;
    background: white;
    border-radius: 8px;
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme, isDragging }) => isDragging ? theme.shadows.md : theme.shadows.sm};
    transform: ${({ isDragging }) => isDragging ? 'scale(1.02)' : 'scale(1)'};
    transition: all 0.2s ease;
    border: 1px solid ${({ theme, isDragging }) => 
        isDragging ? theme.colors.primary : theme.colors.border};
`;

export const StepHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StepContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const StepActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const ActionButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm};
    border: none;
    border-radius: 4px;
    background: ${({ theme, variant }) => 
        variant === 'primary' ? theme.colors.primary : 
        variant === 'secondary' ? theme.colors.secondary :
        variant === 'danger' ? theme.colors.danger : 
        'transparent'
    };
    color: ${({ theme, variant }) => 
        variant ? 'white' : theme.colors.text.secondary
    };
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${({ theme, variant }) => 
            variant === 'primary' ? `${theme.colors.primary}e6` : 
            variant === 'secondary' ? `${theme.colors.secondary}e6` :
            variant === 'danger' ? `${theme.colors.danger}e6` : 
            theme.colors.background
        };
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const DragHandle = styled.div`
    cursor: grab;
    padding: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    
    &:active { 
        cursor: grabbing;
        color: ${({ theme }) => theme.colors.primary};
    }

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export const EditForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
`;

export const Select = styled.select`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    background: white;
    transition: all 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
        outline: none;
    }
`;

export const Input = styled.input`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    transition: all 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
        outline: none;
    }
`;

export const TextArea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    resize: vertical;
    min-height: 80px;
    transition: all 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
        outline: none;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

export const SaveFeedback = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
    
    ${({ status, theme }) => {
        switch(status) {
            case 'saving':
                return `
                    background: ${theme.colors.primary}20;
                    color: ${theme.colors.primary};
                `;
            case 'success':
                return `
                    background: ${theme.colors.success}20;
                    color: ${theme.colors.success};
                `;
            case 'error':
                return `
                    background: ${theme.colors.danger}20;
                    color: ${theme.colors.danger};
                `;
            default:
                return '';
        }
    }}
`;
