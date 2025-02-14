import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FaPlus, FaGripVertical } from 'react-icons/fa';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StepForm from './components/StepForm';
import StepItem from './components/StepItem';
import { useFasi } from './hooks/useFasi';

const Container = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const AddButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: none;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.colors.primary}e6;
    }

    svg {
        font-size: 1.1em;
    }
`;

const StepList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    min-height: 100px;
    padding: ${({ theme }) => theme.spacing.sm} 0;
`;

const DragItem = styled.div`
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    ${({ isDragging, theme }) => isDragging && `
        background: white;
        border-radius: 4px;
        box-shadow: ${theme.shadows.md};
    `}
`;

const DragHandle = styled.div`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: grab;
    
    &:active {
        cursor: grabbing;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md} 0;
    background: ${({ theme }) => theme.colors.danger}15;
    border-radius: 6px;
`;

const PreparationSteps = forwardRef(({ recipeId, isEditing }, ref) => {
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const { 
        fasi, 
        loading, 
        addFase, 
        updateFase, 
        removeFase,
        reorderFasi 
    } = useFasi(recipeId);

    useImperativeHandle(ref, () => ({
        getFasi: () => fasi,
        saveTempFasi: async (newRecipeId) => {
            if (!fasi || fasi.length === 0) return [];
            
            return fasi.map((fase, index) => ({
                tipoLavorazione: fase.tipoLavorazione,
                metodo: fase.metodo,
                tempo: Number(fase.tempo) || 0,
                descrizione: fase.descrizione,
                ordine: index
            }));
        }
    }));

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        try {
            await reorderFasi(sourceIndex, destinationIndex);
            setError(null);
        } catch (error) {
            setError('Errore nel riordinamento delle fasi');
            console.error('Errore nel riordinamento:', error);
        }
    };

    const handleAddFase = async (data) => {
        try {
            await addFase(data);
            setShowForm(false);
            setError(null);
        } catch (error) {
            setError('Errore nell\'aggiunta della fase');
            console.error('Errore nell\'aggiunta della fase:', error);
        }
    };

    const handleUpdateFase = async (index, data) => {
        try {
            await updateFase(index, data);
            setError(null);
        } catch (error) {
            setError('Errore nell\'aggiornamento della fase');
            console.error('Errore nell\'aggiornamento della fase:', error);
        }
    };

    const handleDeleteFase = async (index) => {
        if (window.confirm('Sei sicuro di voler eliminare questa fase?')) {
            try {
                await removeFase(index);
                setError(null);
            } catch (error) {
                setError('Errore nella rimozione della fase');
                console.error('Errore nella rimozione della fase:', error);
            }
        }
    };

    if (loading) {
        return (
            <LoadingWrapper>
                Caricamento fasi...
            </LoadingWrapper>
        );
    }

    return (
        <Container>
            <Header>
                <Title>Fasi di Preparazione</Title>
                {isEditing && !showForm && (
                    <AddButton onClick={() => setShowForm(true)}>
                        <FaPlus /> Aggiungi Fase
                    </AddButton>
                )}
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {showForm && (
                <StepForm 
                    onSubmit={handleAddFase}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps-list" type="PREPARATION_STEP">
                    {(provided) => (
                        <StepList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {fasi.map((fase, index) => {
                                const draggableId = String(fase._id || `temp-${index}`);
                                return (
                                    <Draggable
                                        key={draggableId}
                                        draggableId={draggableId}
                                        index={index}
                                        isDragDisabled={!isEditing}
                                    >
                                        {(provided, snapshot) => (
                                            <DragItem
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                isDragging={snapshot.isDragging}
                                            >
                                                <StepItem 
                                                    fase={fase}
                                                    index={index}
                                                    isEditing={isEditing}
                                                    isDragging={snapshot.isDragging}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    onUpdate={(data) => handleUpdateFase(index, data)}
                                                    onDelete={() => handleDeleteFase(index)}
                                                    DragHandle={DragHandle}
                                                    dragIcon={<FaGripVertical />}
                                                />
                                            </DragItem>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </StepList>
                    )}
                </Droppable>
            </DragDropContext>
        </Container>
    );
});

PreparationSteps.displayName = 'PreparationSteps';

export default PreparationSteps;
