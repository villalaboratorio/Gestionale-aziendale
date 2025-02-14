import React, { memo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import CookingItem from '../CookingItem';

const DroppableContainer = styled.div`
    min-height: 100px;
    padding: 8px 0;
`;

const CookingList = ({
    cotture,
    isEditing,
    onUpdate,
    onDelete,
    onReorder
}) => {
    const handleDragEnd = (result) => {
        console.log('Drag result:', result);
        if (!result.destination) return;
        
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        
        if (sourceIndex === destinationIndex) return;
        
        onReorder(sourceIndex, destinationIndex);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="cooking-list">
                {(provided) => (
                    <DroppableContainer
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {cotture.map((cottura, index) => (
                            <Draggable
                                key={cottura._id}
                                draggableId={cottura._id}
                                index={index}
                                isDragDisabled={!isEditing}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <CookingItem
                                            cottura={cottura}
                                            index={index}
                                            isEditing={isEditing}
                                            isDragging={snapshot.isDragging}
                                            onUpdate={onUpdate}
                                            onDelete={onDelete}
                                            dragHandleProps={provided.dragHandleProps}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </DroppableContainer>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default memo(CookingList);
