const express = require('express');
const router = express.Router();
const processingTypesController = require('../controllers/processingTypesController');

// Rotta per ottenere tutti i tipi di lavorazione
router.get('/', processingTypesController.getProcessingTypes);

// Rotta per creare un nuovo tipo di lavorazione
router.post('/', processingTypesController.createProcessingType);

// Rotta per aggiornare un tipo di lavorazione esistente
router.put('/:id', processingTypesController.updateProcessingType);

// Rotta per eliminare un tipo di lavorazione esistente
router.delete('/:id', processingTypesController.deleteProcessingType);

module.exports = router;
