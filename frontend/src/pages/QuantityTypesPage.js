// GESTIONE OPERATORI
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuantityTypesPage = () => {
    const [quantityTypes, setQuantityTypes] = useState([]);
    const [name, setName] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [description, setDescription] = useState('');
    const [editingType, setEditingType] = useState(null);

    useEffect(() => {
        fetchQuantityTypes();
    }, []);

    const fetchQuantityTypes = async () => {
        try {
            const res = await axios.get('/api/quantity-types');
            setQuantityTypes(res.data);
        } catch (error) {
            console.error('Errore nel recupero operatore:', error);
        }
    };

    const createQuantityType = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/quantity-types', { name, abbreviation, description });
            setQuantityTypes([...quantityTypes, res.data]);
            setName('');
            setAbbreviation('');
            setDescription('');
        } catch (error) {
            console.error('Errore nella creazione del operatore:', error);
        }
    };

    const deleteQuantityType = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo operatore?')) {
            try {
                await axios.delete(`/api/quantity-types/${id}`);
                setQuantityTypes(quantityTypes.filter(type => type._id !== id));
            } catch (error) {
                console.error('Errore nell\'eliminazione del operatore:', error);
            }
        }
    };

    const startEditing = (type) => {
        setEditingType(type);
        setName(type.name);
        setAbbreviation(type.abbreviation);
        setDescription(type.description);
    };

    const cancelEditing = () => {
        setEditingType(null);
        setName('');
        setAbbreviation('');
        setDescription('');
    };

    const updateQuantityType = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/quantity-types/${editingType._id}`, {
                name,
                abbreviation,
                description,
            });
            setQuantityTypes(quantityTypes.map(type => 
                type._id === editingType._id ? res.data : type
            ));
            setEditingType(null);
            setName('');
            setAbbreviation('');
            setDescription('');
        } catch (error) {
            console.error('Errore nell\'aggiornamento del operatore:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestione Operatori</h2>

            <form onSubmit={editingType ? updateQuantityType : createQuantityType} className="mb-4">
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
                    <label>Abbreviazione</label>
                    <input
                        type="text"
                        className="form-control"
                        value={abbreviation}
                        onChange={(e) => setAbbreviation(e.target.value)}
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
                    {editingType ? 'Aggiorna Operatore' : 'Aggiungi Operatore'}
                </button>
                {editingType && (
                    <button type="button" className="btn btn-secondary mt-2 ml-2" onClick={cancelEditing}>
                        Annulla
                    </button>
                )}
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Abbreviazione</th>
                        <th>Descrizione</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {quantityTypes.map(type => (
                        <tr key={type._id}>
                            <td>{type.name}</td>
                            <td>{type.abbreviation}</td>
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
                                    onClick={() => deleteQuantityType(type._id)}
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

export default QuantityTypesPage;
