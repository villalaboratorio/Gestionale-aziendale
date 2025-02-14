// components/dettaglio/actions/LavorazioneActions.js
import React from 'react';
import styled from 'styled-components';
import { FaSave, FaTrash, FaPlay, FaCheck } from 'react-icons/fa';
import { useLavorazioneContext } from '../../../context/LavorazioneContext';

const ActionsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadows.small};
    flex-wrap: wrap;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    background: ${({ variant, theme }) => {
        switch (variant) {
            case 'danger':
                return theme.colors.error;
            case 'success':
                return theme.colors.success;
            case 'warning':
                return theme.colors.warning;
            default:
                return theme.colors.primary;
        }
    }};
    
    color: white;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        filter: brightness(0.9);
    }

    svg {
        font-size: 1.1em;
    }
`;

const LavorazioneActions = () => {
    const {
        data: { lavorazione },
        loadingStates,
        isNew,
        actions
    } = useLavorazioneContext();

    const handleSave = async () => {
        if (window.confirm('Confermi il salvataggio delle modifiche?')) {
            await actions.handleSave();
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Sei sicuro di voler eliminare questa lavorazione?')) {
            await actions.handleDelete();
        }
    };

    const handleStartPhase = async (phase) => {
        if (window.confirm(`Vuoi avviare la fase di ${phase}?`)) {
            await actions.startPhase(phase);
        }
    };

    const handleCompletePhase = async () => {
        if (window.confirm('Confermi il completamento della fase corrente?')) {
            await actions.completeCurrentPhase();
        }
    };

    const renderPhaseActions = () => {
        if (isNew || !lavorazione?._id) return null;

        const currentPhase = lavorazione?.faseCorrente;

        if (currentPhase) {
            return (
                <ActionButton
                    variant="success"
                    onClick={handleCompletePhase}
                    disabled={loadingStates.operations}
                >
                    <FaCheck />
                    Completa {currentPhase}
                </ActionButton>
            );
        }

        return (
            <>
                <ActionButton
                    onClick={() => handleStartPhase('cottura')}
                    disabled={loadingStates.operations}
                >
                    <FaPlay />
                    Avvia Cottura
                </ActionButton>
                <ActionButton
                    onClick={() => handleStartPhase('assemblaggio')}
                    disabled={loadingStates.operations}
                >
                    <FaPlay />
                    Avvia Assemblaggio
                </ActionButton>
            </>
        );
    };

    return (
        <ActionsContainer>
            <ActionButton
                onClick={handleSave}
                disabled={loadingStates.operations}
            >
                <FaSave />
                {loadingStates.operations ? 'Salvataggio...' : 'Salva'}
            </ActionButton>

            {renderPhaseActions()}

            {!isNew && (
                <ActionButton
                    variant="danger"
                    onClick={handleDelete}
                    disabled={loadingStates.operations}
                >
                    <FaTrash />
                    Elimina
                </ActionButton>
            )}
        </ActionsContainer>
    );
};

export default React.memo(LavorazioneActions);
