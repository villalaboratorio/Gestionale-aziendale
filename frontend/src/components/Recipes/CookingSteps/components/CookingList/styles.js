import styled from 'styled-components';

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const EmptyMessage = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    border: 1px dashed ${({ theme }) => theme.colors.border};
`;

export const DragDropArea = styled.div`
    min-height: 100px;
    transition: background-color 0.2s;
    
    ${({ isDraggingOver }) => isDraggingOver && `
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
    `}
`;

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ErrorContainer = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    padding: ${({ theme }) => theme.spacing.md};
    text-align: center;
    border: 1px solid ${({ theme }) => theme.colors.danger};
    border-radius: 4px;
    margin: ${({ theme }) => theme.spacing.md} 0;
`;
