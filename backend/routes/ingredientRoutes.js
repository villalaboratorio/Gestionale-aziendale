const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

// Rotta per la ricerca valori nutrizionali tramite barcode
router.get('/nutrition/:barcode', (req, res, next) => {
    console.log(`Richiesta GET per valori nutrizionali con barcode: ${req.params.barcode}`);
    next();
}, ingredientController.getNutritionByBarcode);

// Rotta per la ricerca prodotti per nome
router.get('/search', (req, res, next) => {
    console.log(`Richiesta GET per ricerca prodotti con query: ${req.query.query}`);
    next();
}, ingredientController.searchOpenFoodFacts);

// Rotta per creare un nuovo ingrediente
router.post('/', (req, res, next) => {
    console.log('Richiesta POST per creare un nuovo ingrediente');
    next();
}, ingredientController.createIngredient);

// Rotta per ottenere tutti gli ingredienti
router.get('/', (req, res, next) => {
    console.log('Richiesta GET per ottenere tutti gli ingredienti');
    next();
}, ingredientController.getAllIngredients);

// Rotta per ottenere un singolo ingrediente per ID
router.get('/:id', (req, res, next) => {
    console.log(`Richiesta GET per ottenere un ingrediente con ID: ${req.params.id}`);
    next();
}, ingredientController.getIngredientById);

// Rotta per aggiornare un ingrediente esistente
router.put('/:id', (req, res, next) => {
    console.log(`Richiesta PUT per aggiornare l'ingrediente con ID: ${req.params.id}`);
    next();
}, ingredientController.updateIngredient);

// Rotta per eliminare un ingrediente esistente
router.delete('/:id', (req, res, next) => {
    console.log(`Richiesta DELETE per eliminare l'ingrediente con ID: ${req.params.id}`);
    next();
}, ingredientController.deleteIngredient);

module.exports = router;
