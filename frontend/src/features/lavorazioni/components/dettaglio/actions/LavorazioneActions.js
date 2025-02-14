import React, { useCallback } from 'react';
import { useStore } from '../../../store/lavorazioneStore';
import { FaSave, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

const ActionsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${props => props.variant === 'danger'
        ? props.theme.colors.danger
        : props.theme.colors.primary};
    color: white;
    border: none;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    svg {
        font-size: 16px;
    }
`;

const LavorazioneActions = () => {
    const { 
        handleSave, 
        handleDelete, 
        loading, 
        isNew, 
        lavorazione 
    } = useStore();

    const onSave = useCallback(() => {
        handleSave(lavorazione);
    }, [handleSave, lavorazione]);

    const onDelete = useCallback(() => {
        if (window.confirm('Sei sicuro di voler eliminare questa lavorazione?')) {
            handleDelete();
        }
    }, [handleDelete]);

    return (
        <ActionsContainer>
            <ActionButton
                onClick={onSave}
                disabled={loading}
                title={isNew ? 'Crea nuova lavorazione' : 'Salva modifiche'}
            >
                <FaSave />
                {isNew ? 'Crea Lavorazione' : 'Salva Modifiche'}
            </ActionButton>
           
            {!isNew && (
                <ActionButton
                    variant="danger"
                    onClick={onDelete}
                    disabled={loading}
                    title="Elimina lavorazione"
                >
                    <FaTrash />
                    Elimina
                </ActionButton>
            )}
        </ActionsContainer>
    );
};

export default React.memo(LavorazioneActions);
