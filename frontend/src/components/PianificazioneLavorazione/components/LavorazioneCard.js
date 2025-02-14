const LavorazioneCard = ({ lavorazione, onEdit, onDelete }) => {
    return (
        <div className="lavorazione-card">
            <div className="card-content">
                <h4>{lavorazione.ricettaNome}</h4>
                <div className="info-content">
                    <div className="info-row">
                        <span>Quantità:</span>
                        <strong>{lavorazione.quantitaTotale.toFixed(2)} kg</strong>
                    </div>
                    <div className="info-row">
                        <span>Porzioni:</span>
                        <strong>{lavorazione.porzioniPreviste}</strong>
                    </div>
                    <div className="info-row">
                        <span>Cliente:</span>
                        <strong>{lavorazione.cliente}</strong>
                    </div>
                </div>
                <div className="card-actions">
                    <button 
                        className="btn-edit"
                        onClick={() => onEdit(lavorazione)}
                    >
                        Modifica
                    </button>
                    <button 
                        className="btn-delete"
                        onClick={() => onDelete(lavorazione)}
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LavorazioneCard;