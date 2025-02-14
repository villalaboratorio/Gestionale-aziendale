import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.error};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.errorLight};
`;

const ErrorMessage = styled.h3`
    color: ${({ theme }) => theme.colors.error};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RetryButton = styled.button`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryDark};
    }
`;

const ErrorBoundary = ({ error, onRetry }) => {
    return (
        <ErrorContainer>
            <ErrorMessage>
                {error?.message || 'Si è verificato un errore'}
            </ErrorMessage>
            {onRetry && (
                <RetryButton onClick={onRetry}>
                    Riprova
                </RetryButton>
            )}
        </ErrorContainer>
    );
};

ErrorBoundary.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string
    }),
    onRetry: PropTypes.func
};

export default ErrorBoundary;
