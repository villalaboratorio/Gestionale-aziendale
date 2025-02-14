import React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import VerificaCell from './verificaCel';
import useLavorazioneStore from '../../../../../../store/lavorazioneStore';

const StyledTable = styled(Table)`
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
   
    th {
        background: ${({ theme }) => theme.colors.background.light};
        color: ${({ theme }) => theme.colors.text.secondary};
        font-weight: 600;
        padding: 1rem;
    }

    td {
        vertical-align: middle;
        padding: 0.75rem;
    }
`;

const IngredientiTable = ({ ingredienti, verifiche }) => {
    const updateVerificaIngrediente = useLavorazioneStore(state => state.updateVerificaIngrediente);

    const handleUpdateVerifica = (ingredienteId, campo, valore) => {
        updateVerificaIngrediente(ingredienteId, {
            ...verifiche[ingredienteId],
            [campo]: valore
        });
    };

    return (
        <StyledTable hover>
            <thead>
                <tr>
                    <th>Ingrediente</th>
                    <th>Quantità</th>
                    <th>TMC</th>
                    <th>Lotto</th>
                    <th>Verifica</th>
                </tr>
            </thead>
            <tbody>
                {ingredienti?.map(ing => (
                    <tr key={ing._id}>
                        <td>{ing?.ingrediente?.name || 'N/D'}</td>
                        <td>{`${ing.quantita ?? 'N/D'} ${ing.unitaMisura?.abbreviation || ''}`}</td>
                        <td>
                            <input
                                type="date"
                                value={verifiche[ing._id]?.tmc || ''}
                                onChange={(e) => handleUpdateVerifica(ing._id, 'tmc', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={verifiche[ing._id]?.lotto || ''}
                                onChange={(e) => handleUpdateVerifica(ing._id, 'lotto', e.target.value)}
                            />
                        </td>
                        <td>
                            <VerificaCell
                                verificato={verifiche[ing._id]?.verificato || false}
                                onChange={(e) => handleUpdateVerifica(ing._id, 'verificato', e.target.checked)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </StyledTable>
    );
};

export default IngredientiTable;