import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { ListContainer } from './styles';

const StepList = ({ children }) => {
    return (
        <Droppable droppableId="steps-list">
            {(provided) => (
                <ListContainer
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {children}
                    {provided.placeholder}
                </ListContainer>
            )}
        </Droppable>
    );
};

export default StepList;
