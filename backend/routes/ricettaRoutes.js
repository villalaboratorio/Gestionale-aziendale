const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const baseController = require('../controllers/recipe/baseController');
const ingredientsController = require('../controllers/recipe/ingredientsController');
const stepsController = require('../controllers/recipe/stepsController');
const cookingController = require('../controllers/recipe/cookingController');
const costController = require('../controllers/recipe/costController');
const Recipe = require('../models/ricettaModel');
// Middleware di logging per tutte le richieste
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Request Body:', req.body);
    console.log('Request Params:', req.params);
    console.log('Request Query:', req.query);
    next();
});

// Middleware di validazione ObjectId
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'ID non valido'
        });
    }
    next();
};

// Rotta per ricette per ingrediente (deve essere prima delle rotte con :id)
router.get('/per-ingrediente/:nome', 
    // Validation middleware
    (req, res, next) => {
        try {
            const nome = decodeURIComponent(req.params.nome);
            if (!nome) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome ingrediente richiesto'
                });
            }
            
            // Normalize and sanitize
            req.ingredientName = nome.toLowerCase().trim();
            console.log('Nome ingrediente normalizzato:', req.ingredientName);
            
            next();
        } catch (error) {
            next(error);
        }
    },
    baseController.getRicettePerIngrediente
);

// Rotta specifica per HACCP che include sempre i dati popolati
router.get('/:id/haccp', validateObjectId, async (req, res, next) => {
    console.log('HACCP endpoint chiamato per ricetta:', req.params.id);
    try {
        const ricetta = await Recipe
            .findById(req.params.id)
            .populate('ingredienti.ingrediente')
            .populate('ingredienti.unitaMisura')
            .lean();

        if (!ricetta) {
            console.log('Ricetta non trovata');
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        console.log('Dati HACCP recuperati:', {
            id: ricetta._id,
            numeroIngredienti: ricetta.ingredienti?.length
        });

        res.json(ricetta);
    } catch (error) {
        console.error('Errore endpoint HACCP:', error);
        next(error);
    }
});


// Rotte principali ricette
router.post('/', (req, res, next) => {
    console.log('Creating new recipe:', req.body);
    next();
}, baseController.createRicetta);

router.get('/', (req, res, next) => {
    console.log('Fetching all recipes');
    next();
}, baseController.getAllRicette);

router.get('/:id', validateObjectId, (req, res, next) => {
    console.log('Fetching recipe by ID:', req.params.id);
    next();
}, baseController.getRicettaById);

router.put('/:id', validateObjectId, (req, res, next) => {
    console.log('Updating recipe:', req.params.id);
    console.log('Update data:', req.body);
    next();
}, baseController.updateRicetta);

router.delete('/:id', validateObjectId, (req, res, next) => {
    console.log('Deleting recipe:', req.params.id);
    next();
}, baseController.deleteRicetta);

// Route per il salvataggio temporaneo della ricetta
router.post('/:id/temp', validateObjectId, (req, res, next) => {
    console.log('Saving temporary recipe:', req.params.id);
    console.log('Temp data:', req.body);
    next();
}, baseController.saveTempRecipe);

// Rotte per ingredienti
router.get('/:id/ingredienti', validateObjectId, (req, res, next) => {
    console.log('Fetching ingredients for recipe:', req.params.id);
    next();
}, ingredientsController.getIngredienti);

router.post('/:id/ingredienti', validateObjectId, (req, res, next) => {
    console.log('Adding ingredient to recipe:', req.params.id);
    console.log('Ingredient data:', req.body);
    next();
}, ingredientsController.addIngrediente);

router.put('/:id/ingredienti/:ingredienteId', validateObjectId, (req, res, next) => {
    console.log('Updating ingredient:', req.params.ingredienteId, 'for recipe:', req.params.id);
    console.log('Update data:', req.body);
    next();
}, ingredientsController.updateIngrediente);

router.delete('/:id/ingredienti/:ingredienteIndex', validateObjectId, (req, res, next) => {
    console.log('Removing ingredient:', req.params.ingredienteIndex, 'from recipe:', req.params.id);
    next();
}, ingredientsController.deleteIngrediente);

router.post('/:id/ingredienti/temp', validateObjectId, (req, res, next) => {
    console.log('Saving temporary ingredients for recipe:', req.params.id);
    console.log('Ingredients data:', req.body);
    next();
}, ingredientsController.saveTempIngredienti);

// Rotte per fasi
router.get('/:id/fasi', validateObjectId, (req, res, next) => {
    console.log('Fetching phases for recipe:', req.params.id);
    next();
}, stepsController.getFasi);

router.post('/:id/fasi', validateObjectId, (req, res, next) => {
    console.log('Adding phase to recipe:', req.params.id);
    console.log('Phase data:', req.body);
    next();
}, stepsController.addFase);

router.put('/:id/fasi/:faseIndex', validateObjectId, (req, res, next) => {
    console.log('Updating phase:', req.params.faseIndex, 'for recipe:', req.params.id);
    console.log('Update data:', req.body);
    next();
}, stepsController.updateFase);

router.delete('/:id/fasi/:faseIndex', validateObjectId, (req, res, next) => {
    console.log('Removing phase:', req.params.faseIndex, 'from recipe:', req.params.id);
    next();
}, stepsController.deleteFase);

router.put('/:id/fasi/reorder', validateObjectId, (req, res, next) => {
    console.log('Reordering phases for recipe:', req.params.id);
    console.log('New order:', req.body.newOrder);
    next();
}, stepsController.reorderFasi);

router.post('/:id/fasi/temp', validateObjectId, (req, res, next) => {
    console.log('Saving temporary phases for recipe:', req.params.id);
    console.log('Phases data:', req.body);
    next();
}, stepsController.saveTempFasi);

// Rotte per cotture
router.get('/:id/cooking', validateObjectId, (req, res, next) => {
    console.log('Fetching cooking steps for recipe:', req.params.id);
    next();
}, cookingController.getCotture);

router.post('/:id/cooking', validateObjectId, (req, res, next) => {
    console.log('Adding cooking step to recipe:', req.params.id);
    console.log('Cooking data:', req.body);
    next();
}, cookingController.addCottura);

router.put('/:id/cooking/:cotturaId', validateObjectId, (req, res, next) => {
    console.log('Updating cooking step:', req.params.cotturaId, 'for recipe:', req.params.id);
    console.log('Update data:', req.body);
    next();
}, cookingController.updateCottura);

router.delete('/:id/cooking/:cotturaId', validateObjectId, (req, res, next) => {
    console.log('Removing cooking step:', req.params.cotturaId, 'from recipe:', req.params.id);
    next();
}, cookingController.deleteCottura);

router.put('/:id/cooking/reorder', validateObjectId, (req, res, next) => {
    console.log('Reordering cooking steps for recipe:', req.params.id);
    console.log('Reorder data:', req.body);
    next();
}, cookingController.reorderCotture);

router.post('/:id/cooking/temp', validateObjectId, (req, res, next) => {
    console.log('Saving temporary cooking steps for recipe:', req.params.id);
    console.log('Cooking data:', req.body);
    next();
}, cookingController.saveTempCotture);

// Rotte per i costi
router.get('/:id/costs', validateObjectId, (req, res, next) => {
    console.log('Fetching costs for recipe:', req.params.id);
    console.log('Route - Richiesta costi ricevuta per ID:', req.params.id);
    next();
}, costController.getRecipeCosts);

module.exports = router;
