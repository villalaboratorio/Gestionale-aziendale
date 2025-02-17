import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../../../atoms';
import { FaPlay, FaStop, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

const ControlsContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &[data-status="start"] {
    background: ${({ theme }) => theme.colors.success};
    &:hover {
      background: ${({ theme }) => theme.colors.successDark};
    }
  }

  &[data-status="stop"] {
    background: ${({ theme }) => theme.colors.warning};
    &:hover {
      background: ${({ theme }) => theme.colors.warningDark};
    }
  }

  &[data-status="delete"] {
    background: ${({ theme }) => theme.colors.danger};
    &:hover {
      background: ${({ theme }) => theme.colors.dangerDark};
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const CotturaControls = ({
  cottura,
  isEditing,
  onStart,
  onComplete,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  disabled
}) => {
  if (!cottura) return null;

  const renderActionButtons = () => {
    switch (cottura.stato) {
      case 'non_iniziata':
        return (
          <>
            {isEditing ? (
              <ButtonGroup>
                <ActionButton
                  onClick={onSave}
                  disabled={disabled}
                  title="Salva modifiche"
                >
                  <FaSave /> Salva
                </ActionButton>
                <ActionButton
                  onClick={onCancel}
                  variant="secondary"
                  title="Annulla modifiche"
                >
                  <FaTimes /> Annulla
                </ActionButton>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <ActionButton
                  data-status="start"
                  onClick={() => onStart(cottura._id)}
                  disabled={disabled}
                  title="Avvia cottura"
                >
                  <FaPlay /> Avvia Cottura
                </ActionButton>
                <ActionButton
                  onClick={() => onEdit(cottura._id)}
                  title="Modifica parametri"
                >
                  <FaEdit /> Modifica
                </ActionButton>
                <ActionButton
                  data-status="delete"
                  onClick={() => onDelete(cottura._id)}
                  title="Elimina cottura"
                >
                  <FaTrash /> Elimina
                </ActionButton>
              </ButtonGroup>
            )}
          </>
        );

      case 'in_corso':
        return (
          <ButtonGroup>
            <ActionButton
              data-status="stop"
              onClick={() => onComplete(cottura._id)}
              disabled={disabled}
              title="Termina cottura"
            >
              <FaStop /> Termina Cottura
            </ActionButton>
            <ActionButton
              onClick={() => onEdit(cottura._id)}
              disabled={true}
              title="Modifica parametri"
            >
              <FaEdit /> Modifica
            </ActionButton>
          </ButtonGroup>
        );

      case 'completata':
        return (
          <ButtonGroup>
            <ActionButton
              onClick={() => onEdit(cottura._id)}
              disabled={true}
              title="Modifica parametri"
            >
              <FaEdit /> Modifica
            </ActionButton>
            <ActionButton
              data-status="delete"
              onClick={() => onDelete(cottura._id)}
              title="Elimina cottura"
            >
              <FaTrash /> Elimina
            </ActionButton>
          </ButtonGroup>
        );

      default:
        return null;
    }
  };

  return (
    <ControlsContainer>
      {renderActionButtons()}
    </ControlsContainer>
  );
};

export default React.memo(CotturaControls);
