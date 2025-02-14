const express = require('express');
const router = express.Router();
const quantityTypesController = require('../controllers/quantityTypesController');

// Rotta per creare una nuova tipologia di quantità
router.post('/', quantityTypesController.createQuantityType);

// Rotta per ottenere tutte le tipologie di quantità
router.get('/', quantityTypesController.getQuantityTypes);

// Rotta per aggiornare una tipologia di quantità
router.put('/:id', quantityTypesController.updateQuantityType);

// Rotta per eliminare una tipologia di quantità
router.delete('/:id', quantityTypesController.deleteQuantityType);

module.exports = router;
