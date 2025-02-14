import React from 'react';
import { ErrorContainer, DismissButton } from './styles';
import { FaTimes } from 'react-icons/fa';

const ErrorMessage = ({ children, onDismiss }) => {
    return (
        <ErrorContainer>
            <span>{children}</span>
            <DismissButton onClick={onDismiss}>
                <FaTimes />
            </DismissButton>
        </ErrorContainer>
    );
};

export default ErrorMessage;
