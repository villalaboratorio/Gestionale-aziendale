import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { FaPlus, FaGripVertical } from 'react-icons/fa';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CookingForm from './components/CookingForm';
import CookingItem from './components/CookingItem';
import { useCookingSteps } from './hooks/useCookingSteps';
import { cookingService } from './services/cookingApiService';

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

const CookingSteps = forwardRef(({ recipeId, isEditing }, ref) => {
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);
    const {
        cotture,
        loading,
        addCottura,
        updateCottura,
        removeCottura,
        reorderCotture
    } = useCookingSteps(recipeId);

    useImperativeHandle(ref, () => ({
        getCotture: () => cotture.map(step => ({
            tipoCottura: step.tipoCottura?._id || step.tipoCottura,
            temperatura: Number(step.temperatura) || 0,
            tempoCottura: Number(step.tempo) || 0,
            note: step.descrizione || '',
            ordine: step.ordine || 0
        })),
        saveTempCotture: async (newRecipeId) => {
            if (!cotture?.length) return;
            
            const cookingData = {
                cotture: cotture.map(step => ({
                    tipoCottura: step.tipoCottura?._id || step.tipoCottura,
                    temperatura: Number(step.temperatura) || 0,
                    tempoCottura: Number(step.tempo) || 0,
                    note: step.descrizione || '',
                    ordine: step.ordine || 0
                }))
            };
  
            return await cookingService.saveTempCotture(newRecipeId || recipeId, cookingData);
        }
    }));

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        try {
            await reorderCotture(sourceIndex, destinationIndex);
            setError(null);
        } catch (error) {
            setError('Errore nel riordinamento delle cotture');
            console.error('Errore nel riordinamento:', error);
        }
    };

    const handleAddCottura = async (data) => {
        try {
            await addCottura(data);
            setShowForm(false);
            setError(null);
        } catch (error) {
            setError('Errore nell\'aggiunta della cottura');
            console.error('Errore nell\'aggiunta della cottura:', error);
        }
    };

    const handleUpdateCottura = async (index, data) => {
        try {
            await updateCottura(index, data);
            setError(null);
        } catch (error) {
            setError('Errore nell\'aggiornamento della cottura');
            console.error('Errore nell\'aggiornamento della cottura:', error);
        }
    };

    const handleDeleteCottura = async (index) => {
        if (window.confirm('Sei sicuro di voler eliminare questa cottura?')) {
            try {
                await removeCottura(index);
                setError(null);
            } catch (error) {
                setError('Errore nella rimozione della cottura');
                console.error('Errore nella rimozione della cottura:', error);
            }
        }
    };

    if (loading) {
        return (
            <LoadingWrapper>
                Caricamento cotture...
            </LoadingWrapper>
        );
    }

    return (
        <Container>
            <Header>
                <Title>Fasi di Cottura</Title>
                {isEditing && !showForm && (
                    <AddButton onClick={() => setShowForm(true)}>
                        <FaPlus /> Aggiungi Cottura
                    </AddButton>
                )}
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {showForm && (
                <CookingForm 
                    onSubmit={handleAddCottura}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="cooking-steps-list" type="COOKING_STEP">
                    {(provided) => (
                        <StepList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {cotture.map((cottura, index) => {
                                const draggableId = String(cottura._id || `temp-${index}`);
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
                                                <CookingItem 
                                                    cottura={cottura}
                                                    index={index}
                                                    isEditing={isEditing}
                                                    isDragging={snapshot.isDragging}
                                                    dragHandleProps={provided.dragHandleProps}
                                                    onUpdate={(data) => handleUpdateCottura(index, data)}
                                                    onDelete={() => handleDeleteCottura(index)}
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

CookingSteps.displayName = 'CookingSteps';

export default CookingSteps;
