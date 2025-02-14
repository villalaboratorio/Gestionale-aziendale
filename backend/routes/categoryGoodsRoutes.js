// backend/routes/categoryGoodsRoutes.js

const express = require('express');
const router = express.Router();
const categoryGoodsController = require('../controllers/categoryGoodsController');

// Rotta per ottenere tutte le categorie
router.get('/', categoryGoodsController.getCategories);

// Rotta per creare una nuova categoria
router.post('/', categoryGoodsController.createCategory);

// Rotta per aggiornare una categoria esistente
router.put('/:id', categoryGoodsController.updateCategory);

// Rotta per eliminare una categoria esistente
router.delete('/:id', categoryGoodsController.deleteCategory);

module.exports = router;
