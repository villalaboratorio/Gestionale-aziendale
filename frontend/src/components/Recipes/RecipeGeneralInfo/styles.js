import styled from 'styled-components';

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.background.light};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Title = styled.h1`
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
`;

export const ActionButtons = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`;

export const Button = styled.button`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: none;
    border-radius: 4px;
    background: ${({ primary, theme }) => primary ? theme.colors.primary : theme.colors.secondary};
    color: white;
    cursor: pointer;
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
    min-height: 400vh;
    scroll-behavior: smooth;
`;

export const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const StyledTabContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
`;

export const StyledTabPane = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.lg};
    
    &.active {
        display: flex;
        flex-direction: column;
    }

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.background};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.colors.primary}40;
    }
`;

export const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.danger}15;
    border-radius: 6px;
`;
