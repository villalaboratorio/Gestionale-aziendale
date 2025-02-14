import styled from 'styled-components';

export const ListContainer = styled.div`
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    overflow: hidden;
`;

export const ListHeader = styled.div`
    background: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

export const ListBody = styled.div`
    background: ${({ theme }) => theme.colors.surface};
`;

export const Row = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr ${({ hasActions }) => hasActions ? '0.5fr' : ''};
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm};
    align-items: center;

    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }

    input {
        width: 100%;
        padding: ${({ theme }) => theme.spacing.xs};
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-radius: 4px;
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

export const Cell = styled.div`
    padding: ${({ theme }) => theme.spacing.xs};
`;

export const DeleteButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.danger};
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.danger}15;
    }
`;

export const TotalsSection = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TotalRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} 0;

    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
`;

export const TotalLabel = styled.span`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TotalValue = styled.span`
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;
export const Select = styled.select`
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    
    &:focus {
        outline: none;
        border-color: #0066cc;
    }
`;
