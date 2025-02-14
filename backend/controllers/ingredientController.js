const mongoose = require('mongoose');
const Ingredient = require('../models/ingredientModel');
const nutritionService = require('../services/nutritionService');

const ingredientController = {
    // GET - Lista ingredienti con paginazione e filtri
    getAllIngredients: async (req, res) => {
        const { page = 1, limit = 20, search } = req.query;
        
        try {
            const query = search 
                ? { 
                    $or: [
                        { code: new RegExp(search, 'i') },
                        { name: new RegExp(search, 'i') }
                    ]
                } 
                : {};

            const ingredients = await Ingredient
                .find(query)
                .populate('unit')
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const count = await Ingredient.countDocuments(query);

            res.status(200).json({
                ingredients,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                totalItems: count
            });
        } catch (error) {
            console.error('Errore nel recupero ingredienti:', error);
            res.status(500).json({ message: 'Errore del server', error });
        }
    },

    // GET - Singolo ingrediente
    getIngredientById: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'ID non valido' });
            }

            const ingredient = await Ingredient.findById(req.params.id).populate('unit');
            
            if (!ingredient) {
                return res.status(404).json({ message: 'Ingrediente non trovato' });
            }

            res.status(200).json(ingredient);
        } catch (error) {
            console.error('Errore nel recupero ingrediente:', error);
            res.status(500).json({ message: 'Errore del server', error });
        }
    },

    // POST - Crea nuovo ingrediente
    createIngredient: async (req, res) => {
        try {
            // Genera codice progressivo
            const lastIngredient = await Ingredient
                .findOne()
                .sort('-code');
            
            let nextCode;
            if (lastIngredient && lastIngredient.code) {
                const lastNumber = parseInt(lastIngredient.code);
                nextCode = (lastNumber + 1).toString().padStart(4, '0');
            } else {
                nextCode = '0001';
            }

            // Recupera dati nutrizionali se presente barcode
            let nutritionData = req.body.nutrition;
            if (req.body.barcode) {
                const openFoodData = await nutritionService.getNutritionByBarcode(req.body.barcode);
                if (openFoodData) {
                    nutritionData = openFoodData;
                }
            }

            const newIngredient = new Ingredient({
                ...req.body,
                code: nextCode,
                nutrition: nutritionData
            });

            const savedIngredient = await newIngredient.save();
            const populatedIngredient = await Ingredient
                .findById(savedIngredient._id)
                .populate('unit');
            
            res.status(201).json(populatedIngredient);
        } catch (error) {
            console.error('Errore nella creazione:', error);
            res.status(400).json({ message: 'Errore nella creazione', error });
        }
    },

    // PUT - Aggiorna ingrediente
    updateIngredient: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'ID non valido' });
            }

            const updatedIngredient = await Ingredient.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('unit');

            if (!updatedIngredient) {
                return res.status(404).json({ message: 'Ingrediente non trovato' });
            }

            res.status(200).json(updatedIngredient);
        } catch (error) {
            console.error('Errore nell\'aggiornamento:', error);
            res.status(400).json({ message: 'Errore nell\'aggiornamento', error });
        }
    },

    // DELETE - Elimina ingrediente
    deleteIngredient: async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'ID non valido' });
            }

            const deletedIngredient = await Ingredient.findByIdAndDelete(req.params.id);
            
            if (!deletedIngredient) {
                return res.status(404).json({ message: 'Ingrediente non trovato' });
            }

            res.status(200).json({ message: 'Ingrediente eliminato con successo' });
        } catch (error) {
            console.error('Errore nella cancellazione:', error);
            res.status(500).json({ message: 'Errore nella cancellazione', error });
        }
    },

    // GET - Ricerca valori nutrizionali tramite barcode
    getNutritionByBarcode: async (req, res) => {
        const { barcode } = req.params;
        try {
            const nutritionData = await nutritionService.getNutritionByBarcode(barcode);
            
            if (!nutritionData) {
                return res.status(404).json({ message: 'Valori nutrizionali non trovati' });
            }
            
            res.status(200).json(nutritionData);
        } catch (error) {
            console.error('Errore nel recupero valori nutrizionali:', error);
            res.status(500).json({ message: 'Errore nel recupero valori nutrizionali', error });
        }
    },

    // GET - Ricerca prodotti in OpenFoodFacts
    searchOpenFoodFacts: async (req, res) => {
        const { query } = req.query;
        try {
            const products = await nutritionService.searchProduct(query);
            res.status(200).json(products);
        } catch (error) {
            console.error('Errore nella ricerca prodotti:', error);
            res.status(500).json({ message: 'Errore nella ricerca prodotti', error });
        }
    }
};

module.exports = ingredientController;
