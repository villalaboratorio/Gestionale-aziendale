import React, { useState } from 'react';
import Button from '../../common/Button/Button';
import './EditForm.css';

const EditForm = ({ lavorazione, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        porzioniPreviste: lavorazione.porzioniPreviste,
        grammiPerPorzione: lavorazione.grammiPerPorzione,
        note: lavorazione.note || ''
    });

    const [errors, setErrors] = useState({
        porzioni: '',
        grammi: ''
    });

    const validateField = (field, value) => {
        let error = '';
        if (field === 'porzioni') {
            if (!value || value <= 0) error = 'Inserire un numero valido di porzioni';
        }
        if (field === 'grammi') {
            if (!value || value <= 0) error = 'Inserire un valore valido per i grammi';
        }
        setErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            quantitaTotale: field === 'porzioniPreviste' || field === 'grammiPerPorzione' 
                ? ((field === 'porzioniPreviste' ? value : prev.porzioniPreviste) * 
                   (field === 'grammiPerPorzione' ? value : prev.grammiPerPorzione)) / 1000
                : prev.quantitaTotale
        }));
        validateField(field, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const porzioniValide = validateField('porzioniPreviste', formData.porzioniPreviste);
        const grammiValidi = validateField('grammiPerPorzione', formData.grammiPerPorzione);

        if (!porzioniValide || !grammiValidi) return;

        const quantitaTotale = (formData.porzioniPreviste * formData.grammiPerPorzione) / 1000;
        onSave(lavorazione.id, { 
            ...formData, 
            quantitaTotale,
            dataModifica: new Date()
        });
    };

    return (
        <div className="edit-form-container">
            <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h4>Modifica Lavorazione</h4>
                </div>
                
                <div className="form-body">
                    <div className="form-group">
                        <label>Porzioni:</label>
                        <input
                            type="number"
                            value={formData.porzioniPreviste}
                            onChange={(e) => handleChange('porzioniPreviste', parseInt(e.target.value))}
                            min="1"
                            className="form-input"
                        />
                        {errors.porzioni && <span className="error-message">{errors.porzioni}</span>}
                    </div>

                    <div className="form-group">
                        <label>Grammi per porzione:</label>
                        <input
                            type="number"
                            value={formData.grammiPerPorzione}
                            onChange={(e) => handleChange('grammiPerPorzione', parseInt(e.target.value))}
                            min="1"
                            className="form-input"
                        />
                        {errors.grammi && <span className="error-message">{errors.grammi}</span>}
                    </div>

                    <div className="form-group">
                        <label>Note:</label>
                        <input
                            type="text"
                            value={formData.note}
                            onChange={(e) => handleChange('note', e.target.value)}
                            placeholder="Aggiungi note..."
                            className="form-input"
                        />
                    </div>

                    <div className="quantita-totale">
                        <span>Quantità Totale:</span>
                        <strong>
                            {((formData.porzioniPreviste * formData.grammiPerPorzione) / 1000).toFixed(2)} kg
                        </strong>
                    </div>
                </div>

                <div className="form-actions">
                    <Button 
                        type="submit" 
                        variant="primary"
                        disabled={!!errors.porzioni || !!errors.grammi}
                    >
                        Salva
                    </Button>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={onCancel}
                    >
                        Annulla
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditForm;
