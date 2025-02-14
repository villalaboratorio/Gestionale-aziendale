import styled from 'styled-components';

// Layout Components
export const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme }) => theme.shadows.small};
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h3`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin: 0;
`;

// PassaggioCard Components
export const Card = styled.div`
    background: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme }) => theme.shadows.small};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const PhaseGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

export const PhaseLabel = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// PhaseControl Components
export const ControlGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const TimeGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const Input = styled.input`
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    
    &:disabled {
        background: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }
    
    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
    }
`;

export const Button = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.spacing.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: white;
    border: none;
    cursor: pointer;
    background: ${({ theme, variant }) => 
        variant === 'end' ? theme.colors.success : theme.colors.primary};
    
    &:hover:not(:disabled) {
        opacity: 0.9;
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: white;
    background: ${({ theme, status }) => {
        switch (status) {
            case 'completed': return theme.colors.success;
            case 'in-progress': return theme.colors.warning;
            default: return theme.colors.secondary;
        }
    }};
`;

export const ActionBar = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Styles = {
    Container,
    Header,
    Title,
    Card,
    PhaseGrid,
    PhaseLabel,
    ControlGroup,
    TimeGroup,
    Input,
    Button,
    StatusBadge,
    ActionBar
};

export default Styles;
