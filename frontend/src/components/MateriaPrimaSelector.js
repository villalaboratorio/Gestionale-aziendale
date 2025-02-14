import React from 'react';

const MateriaPrimaSelector = ({ materiaPrima, onChange }) => {
    return (
        <div className="materia-prima-box">
            <h3>Seleziona Materia Prima</h3>
            <div className="select-container">
                <select 
                    value={materiaPrima.id} 
                    onChange={(e) => onChange('id', e.target.value)}
                >
                    <option value="">Seleziona...</option>
                    {/* Qui verranno caricate le materie prime */}
                </select>
            </div>
            
            <div className="quantita-container">
                <label>Quantità Totale (kg)</label>
                <input 
                    type="number"
                    value={materiaPrima.quantitaTotale}
                    onChange={(e) => onChange('quantitaTotale', e.target.value)}
                />
            </div>

            <div className="info-box">
                <div>Quantità Totale: {materiaPrima.quantitaTotale} kg</div>
                <div>Quantità Residua: {materiaPrima.quantitaResidua} kg</div>
            </div>
        </div>
    );
};

export default MateriaPrimaSelector;
