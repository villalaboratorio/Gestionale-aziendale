import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card } from '../atoms/index.ts';

const StyledCard = styled(Card)`
    text-align: center;
    padding: 1rem;
    background: ${props => {
        switch(props.type) {
            case 'waiting': return '#fff8dc';
            case 'processing': return '#e6fffa';
            case 'completed': return '#f0fff4';
            default: return '#fff';
        }
    }};
`;

const StyledValue = styled.h2`
    color: ${props => {
        switch(props.type) {
            case 'waiting': return '#b7791f';
            case 'processing': return '#2c7a7b';
            case 'completed': return '#2f855a';
            default: return '#2d3748';
        }
    }};
    margin: 0.5rem 0;
    font-weight: bold;
`;

const StatsCard = ({ title, value, type }) => (
    <StyledCard type={type}>
        <h3>{title}</h3>
        <StyledValue type={type}>{value}</StyledValue>
    </StyledCard>
);

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['waiting', 'processing', 'completed', 'total']).isRequired
};

export default StatsCard;
