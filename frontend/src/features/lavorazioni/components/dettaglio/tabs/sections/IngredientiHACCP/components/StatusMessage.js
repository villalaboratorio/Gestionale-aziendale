import React from 'react';
import styled from 'styled-components';
import { Alert } from 'react-bootstrap';
import { FaSpinner, FaExclamationCircle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

const StyledAlert = styled(Alert)`
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    padding: 12px 16px;
`;

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    font-size: 1.2em;
`;

const StatusMessage = React.memo(({ children, loading, error, success, info }) => {
    const getVariant = () => {
        if (error) return 'danger';
        if (success) return 'success';
        if (loading) return 'warning';
        if (info) return 'info';
        return 'info';
    };

    const getIcon = () => {
        if (error) return <FaExclamationCircle />;
        if (success) return <FaCheckCircle />;
        if (loading) return <FaSpinner className="fa-spin" />;
        if (info) return <FaInfoCircle />;
        return <FaInfoCircle />;
    };

    return (
        <StyledAlert variant={getVariant()}>
            <IconWrapper>
                {getIcon()}
            </IconWrapper>
            {children}
        </StyledAlert>
    );
});

export default StatusMessage;
