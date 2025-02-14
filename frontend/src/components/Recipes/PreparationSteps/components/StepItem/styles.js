import styled from 'styled-components';

export const ItemContainer = styled.div`
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    padding-bottom: ${({ theme }) => theme.spacing.xs};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StepNumber = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};

    button {
        background: none;
        border: none;
        cursor: pointer;
        padding: ${({ theme }) => theme.spacing.xs};
        color: ${({ theme }) => theme.colors.text};
        
        &:hover {
            color: ${({ theme }) => theme.colors.primary};
        }
    }
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing.xs};
`;

export const EditForm = styled.form`
    margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
`;

export const Input = styled.input`
    padding: ${({ theme }) => theme.spacing.xs};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

export const Select = styled.select`
    padding: ${({ theme }) => theme.spacing.xs};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.white};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

export const TextArea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.xs};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
    justify-content: flex-end;
`;

export const Button = styled.button`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    
    ${({ variant, theme }) => {
        switch (variant) {
            case 'primary':
                return `
                    background-color: ${theme.colors.primary};
                    color: ${theme.colors.white};
                    &:hover {
                        background-color: ${theme.colors.primaryDark};
                    }
                `;
            case 'secondary':
                return `
                    background-color: ${theme.colors.secondary};
                    color: ${theme.colors.white};
                    &:hover {
                        background-color: ${theme.colors.secondaryDark};
                    }
                `;
            case 'outline':
                return `
                    background-color: transparent;
                    border-color: ${theme.colors.primary};
                    color: ${theme.colors.primary};
                    &:hover {
                        background-color: ${theme.colors.primaryLight};
                    }
                `;
            default:
                return `
                    background-color: ${theme.colors.gray};
                    color: ${theme.colors.text};
                    &:hover {
                        background-color: ${theme.colors.grayDark};
                    }
                `;
        }
    }}
`;

export const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.875rem;
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const FieldError = styled.span`
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.875rem;
    margin-top: 2px;
`;

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const FormWrapper = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const DragHandleWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: grab;
    
    &:active {
        cursor: grabbing;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
