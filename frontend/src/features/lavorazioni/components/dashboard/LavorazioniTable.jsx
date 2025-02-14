import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Button, Badge } from '../atoms/index.ts';
import { FaEye } from 'react-icons/fa';

const TableContainer = styled(Card)`
    overflow: hidden;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
   
    th, td {
        padding: ${props => props.theme?.spacing?.sm || '0.5rem'};
        text-align: left;
        border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
    }
   
    tbody tr:hover {
        background: ${props => props.theme?.colors?.background || '#f5f5f5'};
        cursor: pointer;
    }
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${props => props.theme?.spacing?.md || '1rem'};
`;

const EmptyState = styled.div`
    text-align: center;
    padding: ${props => props.theme?.spacing?.lg || '2rem'};
    color: ${props => props.theme?.colors?.text?.secondary || '#666'};
`;

const LoadingState = styled.div`
    text-align: center;
    padding: ${props => props.theme?.spacing?.lg || '2rem'};
`;

const LavorazioniTable = ({
    lavorazioni = [],
    loading = false,
    pagination,
    onPageChange,
    onRowClick
}) => {
    const clickTimeout = useRef(null);
    
    const handleRowClick = useCallback((id, e) => {
        e.stopPropagation();
        
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }

        clickTimeout.current = setTimeout(() => {
            onRowClick(id);
            clickTimeout.current = null;
        }, 300);
    }, [onRowClick]);

    useEffect(() => {
        return () => {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }
        };
    }, []);

    const getStatusVariant = useCallback((status) => {
        switch (status) {
            case 'IN_LAVORAZIONE': return 'warning';
            case 'COMPLETATA': return 'success';
            case 'IN_ATTESA': return 'info';
            default: return 'default';
        }
    }, []);

    const getPriorityVariant = useCallback((priority) => {
        switch (priority?.toLowerCase()) {
            case 'alta': return 'error';
            case 'media': return 'warning';
            case 'bassa': return 'info';
            default: return 'default';
        }
    }, []);

    if (loading) {
        return <LoadingState>Caricamento in corso...</LoadingState>;
    }

    if (!Array.isArray(lavorazioni) || lavorazioni.length === 0) {
        return <EmptyState>Nessuna lavorazione disponibile</EmptyState>;
    }

    return (
        <TableContainer>
            <StyledTable>
                <thead>
                    <tr>
                        <th>N° Scheda</th>
                        <th>Cliente</th>
                        <th>Stato</th>
                        <th>Data</th>
                        <th>Priorità</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {lavorazioni.map((lavorazione) => (
                        <tr key={lavorazione._id}>
                            <td>{lavorazione.numeroScheda}</td>
                            <td>{lavorazione.cliente?.nome || lavorazione.cliente}</td>
                            <td>
                                <Badge variant={getStatusVariant(lavorazione.statoLavorazione?.name)}>
                                    {lavorazione.statoLavorazione?.name || lavorazione.stato}
                                </Badge>
                            </td>
                            <td>
                                {new Date(lavorazione.dataLavorazione).toLocaleDateString('it-IT')}
                            </td>
                            <td>
                                <Badge variant={getPriorityVariant(lavorazione.prioritaCliente)}>
                                    {lavorazione.prioritaCliente || lavorazione.priorita}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    $variant="icon"
                                    onClick={(e) => handleRowClick(lavorazione._id, e)}
                                >
                                    <FaEye />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
           
            {pagination && pagination.totalPages > 1 && (
                <PaginationContainer>
                    <span>
                        Pagina {pagination.currentPage} di {pagination.totalPages}
                    </span>
                    <div>
                        <Button
                            $variant="secondary"
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                        >
                            Precedente
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                        >
                            Successiva
                        </Button>
                    </div>
                </PaginationContainer>
            )}
        </TableContainer>
    );
};

LavorazioniTable.propTypes = {
    lavorazioni: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        numeroScheda: PropTypes.string,
        cliente: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                nome: PropTypes.string
            })
        ]),
        statoLavorazione: PropTypes.shape({
            name: PropTypes.string
        }),
        dataLavorazione: PropTypes.string,
        prioritaCliente: PropTypes.string
    })),
    loading: PropTypes.bool,
    pagination: PropTypes.shape({
        currentPage: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired
    }).isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowClick: PropTypes.func.isRequired
};

export default React.memo(LavorazioniTable);