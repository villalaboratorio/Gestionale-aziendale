// src/features/lavorazioni/components/atoms/TextArea/index.ts
import styled from 'styled-components';

interface TextAreaProps {
    error?: string;
    disabled?: boolean;
}

const TextArea = styled.textarea<TextAreaProps>`
    width: 100%;
    min-height: 100px;
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme, error }) => error ? theme.colors.error : theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    resize: vertical;
    font-family: inherit;
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.disabled};
        cursor: not-allowed;
    }
`;

export default TextArea;
