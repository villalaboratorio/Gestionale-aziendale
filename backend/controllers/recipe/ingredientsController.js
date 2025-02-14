const Recipe = require('../../models/ricettaModel');
const mongoose = require('mongoose');

const ingredientsController = {
    getIngredienti: async (req, res) => {
        const { id } = req.params;
        
        try {
            const recipe = await Recipe.findById(id)
                .populate({
                    path: 'ingredienti.ingrediente',
                    select: 'nome cost'
                })
                .populate({
                    path: 'ingredienti.unitaMisura',
                    select: 'nome abbreviation'
                })
                .select('ingredienti');

            if (!recipe) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ricetta non trovata'
                });
            }

            return res.json(recipe.ingredienti);
        } catch (error) {
            console.error('Errore in getIngredienti:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Errore nel recupero degli ingredienti',
                error: error.message
            });
        }
    },

    addIngrediente: async (req, res) => {
        const { id } = req.params;
        const ingredientData = req.body;

        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ricetta non trovata'
                });
            }

            recipe.ingredienti.push(ingredientData);
            await recipe.save();

            const updatedRecipe = await Recipe.findById(id)
                .populate('ingredienti.ingrediente')
                .populate('ingredienti.unitaMisura')
                .select('ingredienti');

            return res.status(201).json(updatedRecipe.ingredienti);
        } catch (error) {
            console.error('Errore in addIngrediente:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Errore nell\'aggiunta dell\'ingrediente',
                error: error.message
            });
        }
    },

    updateIngrediente: async (req, res) => {
        const { id, ingredienteId } = req.params;
        const updateData = req.body;

        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ricetta non trovata'
                });
            }

            const ingredientIndex = recipe.ingredienti.findIndex(
                ing => ing._id.toString() === ingredienteId
            );

            if (ingredientIndex === -1) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ingrediente non trovato'
                });
            }

            recipe.ingredienti[ingredientIndex] = {
                ...recipe.ingredienti[ingredientIndex].toObject(),
                ...updateData
            };

            recipe.markModified('ingredienti');
            await recipe.save();

            const updatedRecipe = await Recipe.findById(id)
                .populate('ingredienti.ingrediente')
                .populate('ingredienti.unitaMisura')
                .select('ingredienti');

            return res.json(updatedRecipe.ingredienti);
        } catch (error) {
            console.error('Errore in updateIngrediente:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Errore nell\'aggiornamento dell\'ingrediente',
                error: error.message
            });
        }
    },

    deleteIngrediente: async (req, res) => {
        const { id, ingredienteIndex } = req.params;

        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ricetta non trovata'
                });
            }

            recipe.ingredienti.splice(ingredienteIndex, 1);
            await recipe.save();

            const updatedRecipe = await Recipe.findById(id)
                .populate('ingredienti.ingrediente')
                .populate('ingredienti.unitaMisura')
                .select('ingredienti');

            return res.json(updatedRecipe.ingredienti);
        } catch (error) {
            console.error('Errore in deleteIngrediente:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Errore nella rimozione dell\'ingrediente',
                error: error.message
            });
        }
    },

    saveTempIngredienti: async (req, res) => {
        const { id } = req.params;
        const { ingredienti } = req.body;

        try {
            const recipe = await Recipe.findById(id);
            if (!recipe) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ricetta non trovata'
                });
            }

            recipe.ingredienti = ingredienti;
            recipe.markModified('ingredienti');
            await recipe.save();

            const updatedRecipe = await Recipe.findById(id)
                .populate('ingredienti.ingrediente')
                .populate('ingredienti.unitaMisura')
                .select('ingredienti');

            return res.json(updatedRecipe.ingredienti);
        } catch (error) {
            console.error('Errore in saveTempIngredienti:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Errore nel salvataggio temporaneo degli ingredienti',
                error: error.message
            });
        }
    }
};

module.exports = ingredientsController;
