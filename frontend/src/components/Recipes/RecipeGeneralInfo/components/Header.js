import React from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { Header, Title, ActionButtons, Button } from '../styles';

const RecipeHeader = ({ 
    isEditing, 
    onEdit, 
    onSave, 
    onCancel, 
    onDelete 
}) => {
    return (
        <Header>
            <Title>Dettagli Ricetta</Title>
            <ActionButtons>
                {isEditing ? (
                    <>
                        <Button onClick={onSave}>
                            <FaSave /> Salva
                        </Button>
                        <Button onClick={onCancel}>
                            <FaTimes /> Annulla
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={onEdit}>
                            <FaEdit /> Modifica
                        </Button>
                        <Button $variant="danger" onClick={onDelete}>
                            <FaTrash /> Elimina
                        </Button>
                    </>
                )}
            </ActionButtons>
        </Header>
    );
};

export default RecipeHeader;
