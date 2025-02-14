import styled from 'styled-components';

// Layout components
export const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    max-width: 1400px;
    margin: 0 auto;
`;

export const Content = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
`;

export const Card = styled.div`
    background: #fff;
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    overflow: hidden;
`;

export const CardHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardBody = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
`;

export const InfoCard = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
`;

// Here's where we define EmptyState - make sure it's defined only once
export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    min-height: 200px;

    p {
        color: ${({ theme }) => theme.colors.text.secondary};
        margin-top: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.md};
    }
`;

export const Button = styled.button`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
// Add these new exports alongside existing ones

export const Badge = styled.span`
    display: inline-block;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: 16px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: 500;
    background: ${({ variant = 'primary', theme }) => {
        switch (variant) {
            case 'success': return theme.colors.success;
            case 'warning': return theme.colors.warning;
            case 'danger': return theme.colors.danger;
            default: return theme.colors.primary;
        }
    }};
    color: white;
`;

export const Title = styled.h2`
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
`;
