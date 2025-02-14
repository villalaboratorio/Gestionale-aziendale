import styled from 'styled-components';

const ErrorMessage = ({ message, onClick }) => (
    <ErrorContainer>
        <ErrorText>{message}</ErrorText>
        <RetryButton onClick={onClick}>Riprova</RetryButton>
    </ErrorContainer>
);

const ErrorContainer = styled.div`
    padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
    color: ${({ theme }) => theme?.colors?.error || '#ff0000'};
    background: ${({ theme }) => theme?.colors?.errorLight || '#ffebeb'};
    border-radius: ${({ theme }) => theme?.borderRadius?.md || '4px'};
    margin: ${({ theme }) => theme?.spacing?.md || '1rem'} 0;
`;

const ErrorText = styled.p`
    margin-bottom: 1rem;
`;

const RetryButton = styled.button`
    // stili del bottone
`;

export default ErrorMessage;