const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/unitsController');

// GET - Recupera tutte le unità
router.get('/', unitsController.getAllUnits);

// POST - Crea nuova unità
router.post('/', unitsController.createUnit);

// GET - Recupera singola unità
router.get('/:id', unitsController.getUnitById);

// PUT - Aggiorna unità esistente
router.put('/:id', unitsController.updateUnit);

// DELETE - Elimina unità
router.delete('/:id', unitsController.deleteUnit);

module.exports = router;
