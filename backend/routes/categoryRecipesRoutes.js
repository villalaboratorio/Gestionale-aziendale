const express = require('express');
const router = express.Router();
const categoryRecipesController = require('../controllers/categoryRecipesController');

// Rotta per ottenere tutte le categorie delle ricette
router.get('/', categoryRecipesController.getCategories);

// Rotta per creare una nuova categoria di ricette
router.post('/', categoryRecipesController.createCategory);

// Rotta per aggiornare una categoria di ricette esistente
router.put('/:id', categoryRecipesController.updateCategory);

// Rotta per eliminare una categoria di ricette esistente
router.delete('/:id', categoryRecipesController.deleteCategory);
module.exports = router;
