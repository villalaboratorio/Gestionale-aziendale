import React, { useState } from 'react';
import './LavorazioneLibera.css';

const LavorazioneLibera = ({ materiaPrima, onConfirm, onCancel }) => {
    const [formData, setFormData] = useState({
        quantita: '',
        note: '',
        tipo: 'standard'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const lavorazione = {
            materiaPrima: {
                id: materiaPrima._id,
                lotNumber: materiaPrima.products[0].lotNumber,
                quantitaAssegnata: Number(formData.quantita),
                nome: materiaPrima.products[0].name
            },
            tipo: formData.tipo,
            note: formData.note,
            dataCreazione: new Date(),
            cliente: materiaPrima.cliente?.nome || 'N/D'
        };

        onConfirm(lavorazione);
    };

    return (
        <div className="lavorazione-libera-modal">
            <div className="modal-content">
                <h3>Lavorazione Libera</h3>
                <p>Materia Prima: {materiaPrima.products[0].name}</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Quantità (kg):</label>
                        <input
                            type="number"
                            value={formData.quantita}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                quantita: e.target.value
                            }))}
                            min="0"
                            max={materiaPrima.quantitaResidua}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Tipo Lavorazione:</label>
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                tipo: e.target.value
                            }))}
                        >
                            <option value="standard">Standard</option>
                            <option value="speciale">Speciale</option>
                            <option value="test">Test</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Note:</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                note: e.target.value
                            }))}
                            placeholder="Inserisci note sulla lavorazione..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="confirm-btn">
                            Conferma Lavorazione
                        </button>
                        <button type="button" className="cancel-btn" onClick={onCancel}>
                            Annulla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LavorazioneLibera;
