const CategoryRecipes = require('../models/categoryRecipesModel');

// Ottenere tutte le categorie delle ricette
exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryRecipes.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error });
    }
};

// Creare una nuova categoria di ricette
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new CategoryRecipes({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: 'Errore nella creazione della categoria', error });
    }
};

// Aggiornare una categoria di ricette esistente
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedCategory = await CategoryRecipes.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Errore nell\'aggiornamento della categoria', error });
    }
};

// Eliminare una categoria di ricette esistente
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await CategoryRecipes.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }

        res.status(200).json({ message: 'Categoria eliminata con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error });
    }
};
