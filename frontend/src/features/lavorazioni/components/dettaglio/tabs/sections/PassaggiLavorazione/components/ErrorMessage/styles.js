import styled from 'styled-components';

export const ErrorContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.errorLight};
    border-left: 4px solid ${({ theme }) => theme.colors.error};
    padding: 16px;
    margin: 16px 0;
`;

export const DismissButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;
