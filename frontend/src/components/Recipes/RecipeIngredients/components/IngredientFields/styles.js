import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin: 0;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.danger}15;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin: ${({ theme }) => theme.spacing.sm} 0;
`;

export const LoadingMessage = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;
export const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;
