// features/lavorazioni/components/dashboard/QuickFilters.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Select, Button } from '../atoms/index.ts';

const FiltersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
`;

const QuickFilters = ({ filters, onChange }) => {
    const handleChange = (field) => (event) => {
        onChange({ ...filters, [field]: event.target.value });
    };

    return (
        <FiltersGrid>
            <Input
                type="text"
                placeholder="Cerca..."
                value={filters.search || ''}
                onChange={handleChange('search')}
            />
            <Input
                as="select"
                value={filters.stato || ''}
                onChange={handleChange('stato')}
            >
                <option value="">Tutti gli stati</option>
                <option value="IN_ATTESA">In Attesa</option>
                <option value="IN_CORSO">In Corso</option>
                <option value="COMPLETATA">Completata</option>
            </Input>
            <Input
                as="select"
                value={filters.priorita || ''}
                onChange={handleChange('priorita')}
            >
                <option value="">Tutte le priorità</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="bassa">Bassa</option>
            </Input>
            <Input
                type="date"
                value={filters.dataInizio || ''}
                onChange={handleChange('dataInizio')}
            />
            <Input
                type="date"
                value={filters.dataFine || ''}
                onChange={handleChange('dataFine')}
            />
        </FiltersGrid>
    );
};

QuickFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default QuickFilters;
