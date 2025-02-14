const express = require('express');
const router = express.Router();
const processingStatesController = require('../controllers/processingStatesController');

// Rotta per creare un nuovo stato di lavorazione
router.post('/', processingStatesController.createState);

// Rotta per ottenere tutti gli stati di lavorazione
router.get('/', processingStatesController.getStates);

// Rotta per aggiornare uno stato di lavorazione
router.put('/:id', processingStatesController.updateState);

// Rotta per eliminare uno stato di lavorazione
router.delete('/:id', processingStatesController.deleteState);

module.exports = router;
