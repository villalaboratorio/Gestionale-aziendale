import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryRecipesPage = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/category-recipes');
            console.log('Categorie recuperate:', res.data);  // Log per verificare i dati recuperati
            setCategories(res.data);
        } catch (error) {
            console.error('Errore nel recupero delle categorie:', error);
        }
    };

    const createCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/category-recipes', { name, description });
            console.log('Categoria creata:', res.data);  // Log per verificare la creazione della categoria
            setCategories([...categories, res.data]);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Errore nella creazione della categoria:', error);
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa categoria?')) {
            try {
                await axios.delete(`/api/category-recipes/${id}`);
                console.log(`Categoria con ID ${id} eliminata`);  // Log per la conferma dell'eliminazione
                setCategories(categories.filter(category => category._id !== id));
            } catch (error) {
                console.error('Errore nell\'eliminazione della categoria:', error);
            }
        }
    };

    const startEditing = (category) => {
        console.log('Modifica della categoria:', category);  // Log per la categoria che si sta modificando
        setEditingCategory(category);
        setName(category.name);
        setDescription(category.description);
    };

    const cancelEditing = () => {
        console.log('Modifica annullata');  // Log per l'annullamento della modifica
        setEditingCategory(null);
        setName('');
        setDescription('');
    };

    const updateCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/category-recipes/${editingCategory._id}`, {
                name,
                description,
            });
            console.log('Categoria aggiornata:', res.data);  // Log per verificare l'aggiornamento della categoria
            setCategories(categories.map(category => 
                category._id === editingCategory._id ? res.data : category
            ));
            setEditingCategory(null);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Errore nell\'aggiornamento della categoria:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestione Categorie Ricette</h2>

            <form onSubmit={editingCategory ? updateCategory : createCategory} className="mb-4">
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
                    {editingCategory ? 'Aggiorna Categoria' : 'Aggiungi Categoria'}
                </button>
                {editingCategory && (
                    <button type="button" className="btn btn-secondary mt-2 ml-2" onClick={cancelEditing}>
                        Annulla
                    </button>
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
                    {categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm mr-2"
                                    onClick={() => startEditing(category)}
                                >
                                    Modifica
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteCategory(category._id)}
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

export default CategoryRecipesPage;
