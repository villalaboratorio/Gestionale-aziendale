import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

// Rotating animation
const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

// Main spinner container
const SpinnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.md};
`;

// Spinner element with size variants
const SpinnerElement = styled.div`
    width: ${({ size }) => {
        switch(size) {
            case 'small': return '20px';
            case 'large': return '50px';
            default: return '35px';
        }
    }};
    height: ${({ size }) => {
        switch(size) {
            case 'small': return '20px';
            case 'large': return '50px';
            default: return '35px';
        }
    }};
    border: 3px solid ${({ theme }) => theme.colors.background};
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
`;

// Optional loading text
const LoadingText = styled.p`
    margin-top: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ size }) => size === 'large' ? '1.1em' : '0.9em'};
`;

const LoadingSpinner = ({ size = 'medium', text }) => {
    return (
        <SpinnerWrapper>
            <SpinnerElement size={size} />
            {text && <LoadingText size={size}>{text}</LoadingText>}
        </SpinnerWrapper>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    text: PropTypes.string
};

export default React.memo(LoadingSpinner);
