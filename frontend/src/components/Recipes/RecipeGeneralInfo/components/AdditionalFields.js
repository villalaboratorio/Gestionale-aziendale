import React from 'react';
import { FormGroup, Label, TextArea } from '../styles';

const AdditionalFields = ({
    editedRecipe,
    isEditing,
    onChange
}) => {
    return (
        <FormGroup>
            <Label>Note</Label>
            <TextArea
                value={editedRecipe?.note || ''}
                onChange={(e) => onChange('note', e.target.value)}
                disabled={!isEditing}
                placeholder="Aggiungi eventuali note o consigli"
                rows={4}
            />
        </FormGroup>
    );
};

export default AdditionalFields;
