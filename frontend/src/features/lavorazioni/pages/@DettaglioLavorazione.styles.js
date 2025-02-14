import styled, { css } from 'styled-components';
import { Form } from 'react-bootstrap';
import theme from '../../../styles/theme';

// Layout Base
export const PageContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.div`
    background: white;
    border-radius: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transition: box-shadow 0.3s ease;
    
    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.large};
    }
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
`;

// Header Components
export const HeaderContainer = styled.div`
    background: white;
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme }) => theme.shadows.small};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const HeaderTitle = styled.h1`
    font-size: ${({ theme }) => theme.typography.h2};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
`;

export const InfoItem = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    
    strong {
        color: ${({ theme }) => theme.colors.text.primary};
        font-weight: 500;
    }
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.typography.small};
    background: ${props => props.color || props.theme.colors.primary};
    color: white;
`;

// Form Components
export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
    background: white;
    border-radius: ${({ theme }) => theme.spacing.sm};
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    align-items: start;
`;

export const FormField = styled(Form.Group)`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    transition: all 0.2s ease;
    
    ${({ isDirty, theme }) => isDirty && css`
        label {
            color: ${theme.colors.primary};
            font-weight: 500;
        }
        
        select, input, textarea {
            border-color: ${theme.colors.primary};
            box-shadow: 0 0 0 1px ${theme.colors.primary}15;
        }
    `}
    
    label {
        margin-bottom: ${({ theme }) => theme.spacing.xs};
        font-weight: 500;
    }
    
    input, select, textarea {
        border-radius: ${({ theme }) => theme.spacing.xs};
        border: 1px solid ${({ theme }) => theme.colors.border};
        padding: ${({ theme }) => theme.spacing.sm};
        width: 100%;
        
        &:focus {
            outline: none;
            border-color: ${theme.colors.primary};
            box-shadow: 0 0 0 3px ${theme.colors.primary}15;
        }
    }
`;

// Error Components
export const ErrorContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.errorLight};
    color: ${({ theme }) => theme.colors.error};
    border-radius: ${({ theme }) => theme.spacing.sm};
    margin: ${({ theme }) => theme.spacing.md};
    border-left: 4px solid ${({ theme }) => theme.colors.error};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
    font-size: ${({ theme }) => theme.typography.small};
    margin-top: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`;
