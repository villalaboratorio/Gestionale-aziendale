import styled from 'styled-components';

export const Container = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    padding: ${({ theme }) => theme.spacing.lg};
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const Button = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const LoadingMessage = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const ErrorMessage = styled.div`
    margin: ${({ theme }) => theme.spacing.md} 0;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => `${theme.colors.danger}10`};
    border: 1px solid ${({ theme }) => theme.colors.danger};
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.danger};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
export const EmptyMessage = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    border: 1px dashed ${({ theme }) => theme.colors.border};
`;
