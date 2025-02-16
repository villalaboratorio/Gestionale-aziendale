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
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  &[data-status="start"] {
    background: ${({ theme }) => theme.colors.success};
  }
  
  &[data-status="stop"] {
    background: ${({ theme }) => theme.colors.warning};
  }
  
  &[data-status="delete"] {
    background: ${({ theme }) => theme.colors.danger};
  }
`;

const CotturaControls = ({
  cottura,
  isEditing,
  onStart,
  onComplete,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) => {
  const renderButtons = () => {
    switch (cottura.stato) {
      case 'non_iniziata':
        return (
          <>
            {isEditing ? (
              <>
                <ActionButton onClick={onSave}>
                  <FaSave /> Salva
                </ActionButton>
                <ActionButton onClick={onCancel} variant="secondary">
                  <FaTimes /> Annulla
                </ActionButton>
              </>
            ) : (
              <>
                <ActionButton data-status="start" onClick={onStart}>
                  <FaPlay /> Avvia Cottura
                </ActionButton>
                <ActionButton onClick={onEdit}>
                  <FaEdit /> Modifica
                </ActionButton>
                <ActionButton data-status="delete" onClick={onDelete}>
                  <FaTrash /> Elimina
                </ActionButton>
              </>
            )}
          </>
        );

      case 'in_corso':
        return (
          <>
            <ActionButton data-status="stop" onClick={onComplete}>
              <FaStop /> Termina Cottura
            </ActionButton>
            <ActionButton onClick={onEdit}>
              <FaEdit /> Modifica
            </ActionButton>
          </>
        );

      case 'completata':
        return (
          <>
            <ActionButton onClick={onEdit}>
              <FaEdit /> Modifica
            </ActionButton>
            <ActionButton data-status="delete" onClick={onDelete}>
              <FaTrash /> Elimina
            </ActionButton>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ControlsContainer>
      {renderButtons()}
    </ControlsContainer>
  );
};

export default React.memo(CotturaControls);
