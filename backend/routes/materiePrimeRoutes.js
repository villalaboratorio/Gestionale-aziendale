const express = require('express');
const router = express.Router();
const materiePrimeController = require('../controllers/materiePrimeController');

// Rotta per creare una nuova materia prima con caricamento file
router.post('/', materiePrimeController.uploadDocument, materiePrimeController.createMateriaPrima);

// Rotta per ottenere tutte le materie prime
router.get('/', materiePrimeController.getMateriePrime);

// Rotta per ottenere una singola materia prima per ID
router.get('/:id', materiePrimeController.getMateriaPrimaById);

// Rotta per aggiornare una materia prima per ID con caricamento file
router.put('/:id', materiePrimeController.uploadDocument, materiePrimeController.updateMateriaPrima);

// Rotta per eliminare una materia prima per ID
router.delete('/:id', materiePrimeController.deleteMateriaPrima);

// Rotta per registrare un prelievo su una materia prima
router.post('/:id/prelievo', materiePrimeController.prelevaMateriaPrima);

module.exports = router;
