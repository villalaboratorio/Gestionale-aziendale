import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { useFasiOptions } from '../../hooks/useFasiOptions';
import {
    ItemContainer,
    Header,
    Content,
    ActionButtons,
    EditForm,
    FormGroup,
    Label,
    Select,
    Input,
    TextArea,
    ButtonGroup,
    Button,
    DragHandleWrapper
} from './styles';

const StepItem = ({
    fase,
    index,
    isEditing,
    isDragging,
    dragHandleProps,
    onUpdate,
    onDelete,
    DragHandle,
    dragIcon
}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(fase);
    const { tipi, metodi } = useFasiOptions();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        await onUpdate(editData);
        setIsEditMode(false);
    };

    const renderViewMode = () => (
        <>
            <Header>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isEditing && (
                        <DragHandleWrapper {...dragHandleProps}>
                            {dragIcon}
                        </DragHandleWrapper>
                    )}
                    <span>Fase {index + 1}</span>
                </div>
                {isEditing && (
                    <ActionButtons>
                        <Button onClick={() => setIsEditMode(true)}>
                            <FaEdit />
                        </Button>
                        <Button onClick={onDelete}>
                            <FaTrash />
                        </Button>
                    </ActionButtons>
                )}
            </Header>
            <Content>
                <div>
                    <strong>Tipo:</strong> {tipi.find(t => t._id === fase.tipoLavorazione)?.name}
                </div>
                <div>
                    <strong>Metodo:</strong> {metodi.find(m => m._id === fase.metodo)?.name}
                </div>
                {fase.tempo > 0 && (
                    <div>
                        <strong>Tempo:</strong> {fase.tempo} minuti
                    </div>
                )}
                {fase.descrizione && (
                    <div>
                        <strong>Descrizione:</strong> {fase.descrizione}
                    </div>
                )}
            </Content>
        </>
    );

    const renderEditMode = () => (
        <EditForm>
            <FormGroup>
                <Label>Tipo Lavorazione</Label>
                <Select
                    name="tipoLavorazione"
                    value={editData.tipoLavorazione}
                    onChange={handleChange}
                >
                    {tipi.map(tipo => (
                        <option key={tipo._id} value={tipo._id}>
                            {tipo.name}
                        </option>
                    ))}
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Metodo</Label>
                <Select
                    name="metodo"
                    value={editData.metodo}
                    onChange={handleChange}
                >
                    {metodi.map(metodo => (
                        <option key={metodo._id} value={metodo._id}>
                            {metodo.name}
                        </option>
                    ))}
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Tempo (minuti)</Label>
                <Input
                    type="number"
                    name="tempo"
                    value={editData.tempo}
                    onChange={handleChange}
                    min="0"
                />
            </FormGroup>

            <FormGroup>
                <Label>Descrizione</Label>
                <TextArea
                    name="descrizione"
                    value={editData.descrizione}
                    onChange={handleChange}
                    rows={3}
                />
            </FormGroup>

            <ButtonGroup>
                <Button variant="primary" onClick={handleSave}>
                    <FaSave /> Salva
                </Button>
                <Button variant="secondary" onClick={() => setIsEditMode(false)}>
                    <FaTimes /> Annulla
                </Button>
            </ButtonGroup>
        </EditForm>
    );

    return (
        <ItemContainer isDragging={isDragging}>
            {isEditMode ? renderEditMode() : renderViewMode()}
        </ItemContainer>
    );
};

export default StepItem;
