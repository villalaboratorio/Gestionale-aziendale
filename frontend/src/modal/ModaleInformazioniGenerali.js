import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Modal.css';

const ModaleInformazioniGenerali = ({ isOpen, onClose, onSave, initialData, isNew }) => {
    const [clienti, setClienti] = useState([]);
    const [ricette, setRicette] = useState([]);
    const [processingTypes, setProcessingTypes] = useState([]);
    const [processingStates, setProcessingStates] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        numeroScheda: '',
        cliente: '',
        dataLavorazione: new Date().toISOString().split('T')[0],
        ricetta: '',
        tipoLavorazione: '',
        statoLavorazione: '',
        informazioniGenerali: {
            descrizione: '',
            note: '',
            dataConsegnaPrevista: new Date().toISOString().split('T')[0],
            prioritaCliente: 'media',
            isUrgente: false,
            noteUrgenza: '',
            noteProduzione: '',
            noteAllergeni: '',
            noteConfezionamento: '',
            allergeni: []
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setFormData(prev => ({
                    ...prev,
                    ...initialData,
                    dataLavorazione: initialData.dataLavorazione ? 
                        new Date(initialData.dataLavorazione).toISOString().split('T')[0] : 
                        new Date().toISOString().split('T')[0],
                    cliente: initialData.cliente?._id || '',
                    ricetta: initialData.ricetta?._id || '',
                    tipoLavorazione: initialData.tipoLavorazione?._id || '',
                    statoLavorazione: initialData.statoLavorazione?._id || '',
                    informazioniGenerali: {
                        ...prev.informazioniGenerali,
                        ...initialData.informazioniGenerali,
                        dataConsegnaPrevista: initialData.informazioniGenerali?.dataConsegnaPrevista ? 
                            new Date(initialData.informazioniGenerali.dataConsegnaPrevista).toISOString().split('T')[0] : 
                            new Date().toISOString().split('T')[0]
                    }
                }));
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        try {
            const [clientiRes, ricetteRes, typesRes, statesRes] = await Promise.all([
                axios.get('/api/clienti'),
                axios.get('/api/ricette'),
                axios.get('/api/processing-types'),
                axios.get('/api/processing-states')
            ]);

            setClienti(clientiRes.data);
            setRicette(ricetteRes.data);
            setProcessingTypes(typesRes.data);
            setProcessingStates(statesRes.data);
            setError('');
        } catch (error) {
            setError('Errore nel caricamento dei dati');
            console.error('Errore:', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleInformazioniGeneraliChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            informazioniGenerali: {
                ...prev.informazioniGenerali,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                informazioniGenerali: {
                    ...formData.informazioniGenerali,
                    dataConsegnaPrevista: formData.informazioniGenerali.dataConsegnaPrevista || 
                        new Date().toISOString().split('T')[0]
                }
            };
            await onSave(dataToSend);
            onClose();
        } catch (error) {
            setError('Errore durante il salvataggio');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{isNew ? 'Nuova Lavorazione' : 'Modifica Lavorazione'}</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Cliente *</label>
                        <select
                            value={formData.cliente}
                            onChange={(e) => handleChange('cliente', e.target.value)}
                            required
                        >
                            <option value="">Seleziona un cliente</option>
                            {clienti.map(cliente => (
                                <option key={cliente._id} value={cliente._id}>
                                    {cliente.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ricetta *</label>
                        <select
                            value={formData.ricetta}
                            onChange={(e) => handleChange('ricetta', e.target.value)}
                            required
                        >
                            <option value="">Seleziona una ricetta</option>
                            {ricette.map(ricetta => (
                                <option key={ricetta._id} value={ricetta._id}>
                                    {ricetta.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tipo di Lavorazione *</label>
                        <select
                            value={formData.tipoLavorazione}
                            onChange={(e) => handleChange('tipoLavorazione', e.target.value)}
                            required
                        >
                            <option value="">Seleziona un tipo</option>
                            {processingTypes.map(type => (
                                <option key={type._id} value={type._id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Stato della Lavorazione *</label>
                        <select
                            value={formData.statoLavorazione}
                            onChange={(e) => handleChange('statoLavorazione', e.target.value)}
                            required
                        >
                            <option value="">Seleziona uno stato</option>
                            {processingStates.map(state => (
                                <option key={state._id} value={state._id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Data Lavorazione *</label>
                        <input
                            type="date"
                            value={formData.dataLavorazione}
                            onChange={(e) => handleChange('dataLavorazione', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Data Consegna Prevista *</label>
                        <input
                            type="date"
                            value={formData.informazioniGenerali.dataConsegnaPrevista}
                            onChange={(e) => handleInformazioniGeneraliChange('dataConsegnaPrevista', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Priorità Cliente</label>
                        <select
                            value={formData.informazioniGenerali.prioritaCliente}
                            onChange={(e) => handleInformazioniGeneraliChange('prioritaCliente', e.target.value)}
                        >
                            <option value="bassa">Bassa</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.informazioniGenerali.isUrgente}
                                onChange={(e) => handleInformazioniGeneraliChange('isUrgente', e.target.checked)}
                            />
                            Urgente
                        </label>
                    </div>

                    {formData.informazioniGenerali.isUrgente && (
                        <div className="form-group">
                            <label>Note Urgenza</label>
                            <textarea
                                value={formData.informazioniGenerali.noteUrgenza}
                                onChange={(e) => handleInformazioniGeneraliChange('noteUrgenza', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Note Produzione</label>
                        <textarea
                            value={formData.informazioniGenerali.noteProduzione}
                            onChange={(e) => handleInformazioniGeneraliChange('noteProduzione', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Note Allergeni</label>
                        <textarea
                            value={formData.informazioniGenerali.noteAllergeni}
                            onChange={(e) => handleInformazioniGeneraliChange('noteAllergeni', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Note Confezionamento</label>
                        <textarea
                            value={formData.informazioniGenerali.noteConfezionamento}
                            onChange={(e) => handleInformazioniGeneraliChange('noteConfezionamento', e.target.value)}
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="save-button">
                            Salva
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            Annulla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModaleInformazioniGenerali;
