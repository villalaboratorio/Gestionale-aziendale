import React from 'react';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

const VerificaContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StatusIcon = styled.span`
    color: ${({ verificato, theme }) =>
        verificato ? theme.colors.success : theme.colors.danger};
    display: flex;
    align-items: center;
`;

const StyledCheckbox = styled(Form.Check)`
    margin: 0;
`;

const VerificaCell = ({ verificato, onChange }) => {
    return (
        <VerificaContainer>
            <StyledCheckbox
                type="checkbox"
                checked={verificato}
                onChange={onChange}
            />
            <StatusIcon verificato={verificato}>
                {verificato ? <FaCheck /> : <FaTimes />}
            </StatusIcon>
        </VerificaContainer>
    );
};

export default React.memo(VerificaCell);
