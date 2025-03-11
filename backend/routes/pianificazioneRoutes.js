const express = require('express');
const router = express.Router();
const pianificazioneController = require('../controllers/pianificazioneController');

// Middleware per logging
const logRequest = (req, res, next) => {
  console.log(`🔍 API Pianificazione: ${req.method} ${req.url}`);
  next();
};

router.use(logRequest);

// Ottiene materie prime disponibili
router.get('/materie-prime', pianificazioneController.getMateriePrimeDisponibili);

// Ottiene suggerimenti ricette per una materia prima
router.get('/suggerimenti', pianificazioneController.getSuggerimentiRicette);

// Conferma lavorazioni
router.post('/conferma', pianificazioneController.confermaLavorazioni);

module.exports = router;
