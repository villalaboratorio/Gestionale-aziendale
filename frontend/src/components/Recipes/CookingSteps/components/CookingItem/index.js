import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaGripVertical } from 'react-icons/fa';
import { useCookingOptions } from '../../hooks/useCookingOption';
import {
    StepContainer,
    StepHeader,
    StepContent,
    StepActions,
    ActionButton,
    DragHandle,
    EditForm,
    FormGroup,
    Label,
    Select,
    Input,
    TextArea,
    ButtonGroup,
    SaveFeedback
} from './styles';

const CookingItem = ({
    cottura,
    index,
    isEditing,
    isDragging,
    dragHandleProps,
    onUpdate,
    onDelete
}) => {
    console.log('Cottura completa:', cottura);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(cottura);
    const [saveStatus, setSaveStatus] = useState(null);
    const { tipiCottura } = useCookingOptions();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = ['temperatura', 'tempoCottura'].includes(name)
            ? value === '' ? '' : Number(value)
            : value;
        
        setEditData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };
    
    const handleSave = async () => {
        try {
            setSaveStatus('saving');
            await onUpdate(index, editData);
            setSaveStatus('success');
            setTimeout(() => {
                setSaveStatus(null);
                setIsEditMode(false);
            }, 800);
        } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 2000);
            console.error('Errore salvataggio:', error);
        }
    };

    const renderViewMode = () => (
        <>
            <StepHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isEditing && (
                        <DragHandle {...dragHandleProps}>
                            <FaGripVertical />
                        </DragHandle>
                    )}
                    <span>Cottura {index + 1}</span>
                </div>
                {isEditing && (
                    <StepActions>
                        <ActionButton onClick={() => setIsEditMode(true)}>
                            <FaEdit />
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => onDelete(index)}>
                            <FaTrash />
                        </ActionButton>
                    </StepActions>
                )}
            </StepHeader>
            <StepContent>
                <div>
                    <strong>Tipo:</strong> {cottura.tipoCottura.name}
                </div>
                <div>
                    <strong>Temperatura:</strong> {cottura.temperatura}°C
                </div>
                {cottura.tempoCottura > 0 && (
                    <div>
                        <strong>Tempo:</strong> {cottura.tempoCottura} minuti
                    </div>
                )}
                {cottura.note && (
                    <div>
                        <strong>Note:</strong> {cottura.note}
                    </div>
                )}
            </StepContent>
        </>
    );

    const renderEditMode = () => (
        <EditForm>
            <FormGroup>
                <Label>Tipo Cottura</Label>
                <Select
                    name="tipoCottura"
                    value={editData.tipoCottura}
                    onChange={handleChange}
                >
                    {tipiCottura.map(tipo => (
                        <option key={tipo._id} value={tipo._id}>
                            {tipo.name}
                        </option>
                    ))}
                </Select>
            </FormGroup>

            <FormGroup>
                <Label>Temperatura (°C)</Label>
                <Input
                    type="number"
                    name="temperatura"
                    value={editData.temperatura}
                    onChange={handleChange}
                    min="0"
                />
            </FormGroup>

            <FormGroup>
                <Label>Tempo (minuti)</Label>
                <Input
                    type="number"
                    name="tempoCottura"
                    value={editData.tempoCottura}
                    onChange={handleChange}
                    min="0"
                />
            </FormGroup>

            <FormGroup>
                <Label>Note</Label>
                <TextArea
                    name="note"
                    value={editData.note}
                    onChange={handleChange}
                    rows={3}
                />
            </FormGroup>

            <ButtonGroup>
                <ActionButton variant="primary" onClick={handleSave}>
                    <FaSave /> {saveStatus === 'saving' ? 'Salvataggio...' : 'Salva'}
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => setIsEditMode(false)}>
                    <FaTimes /> Annulla
                </ActionButton>
            </ButtonGroup>
        </EditForm>
    );

    return (
        <StepContainer isDragging={isDragging}>
            {isEditMode ? renderEditMode() : renderViewMode()}
            {saveStatus && (
                <SaveFeedback status={saveStatus}>
                    {saveStatus === 'saving' && 'Salvataggio...'}
                    {saveStatus === 'success' && 'Salvato!'}
                    {saveStatus === 'error' && 'Errore nel salvataggio'}
                </SaveFeedback>
            )}
        </StepContainer>
    );
};

export default CookingItem;
