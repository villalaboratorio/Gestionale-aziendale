import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProcessingTypesPage = () => {
    const [processingTypes, setProcessingTypes] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingType, setEditingType] = useState(null);

    useEffect(() => {
        fetchProcessingTypes();
    }, []);

    const fetchProcessingTypes = async () => {
        try {
            const res = await axios.get('/api/processing-types');
            setProcessingTypes(res.data);
        } catch (error) {
            console.error('Errore nel recupero dei tipi di lavorazione:', error);
        }
    };

    const createProcessingType = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/processing-types', { name, description });
            setProcessingTypes([...processingTypes, res.data]);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Errore nella creazione del tipo di lavorazione:', error);
        }
    };

    const deleteProcessingType = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo tipo di lavorazione?')) {
            try {
                await axios.delete(`/api/processing-types/${id}`);
                setProcessingTypes(processingTypes.filter(type => type._id !== id));
            } catch (error) {
                console.error('Errore nell\'eliminazione del tipo di lavorazione:', error);
            }
        }
    };

    const startEditing = (type) => {
        setEditingType(type);
        setName(type.name);
        setDescription(type.description);
    };

    const cancelEditing = () => {
        setEditingType(null);
        setName('');
        setDescription('');
    };

    const updateProcessingType = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/processing-types/${editingType._id}`, {
                name,
                description,
            });
            setProcessingTypes(processingTypes.map(type => 
                type._id === editingType._id ? res.data : type
            ));
            setEditingType(null);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Errore nell\'aggiornamento del tipo di lavorazione:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestione Tipi di Lavorazione</h2>

            <form onSubmit={editingType ? updateProcessingType : createProcessingType} className="mb-4">
                <div className="form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Descrizione</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">
    {editingType ? 'Aggiorna Tipo di Lavorazione' : 'Aggiungi Tipo di Lavorazione'}
</button>
{editingType && (
    <button type="button" className="btn btn-secondary mt-2 ml-2" onClick={cancelEditing}>
        Annulla
    </button>
)}

                )}
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrizione</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {processingTypes.map(type => (
                        <tr key={type._id}>
                            <td>{type.name}</td>
                            <td>{type.description}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm mr-2"
                                    onClick={() => startEditing(type)}
                                >
                                    Modifica
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteProcessingType(type._id)}
                                >
                                    Elimina
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProcessingTypesPage;
