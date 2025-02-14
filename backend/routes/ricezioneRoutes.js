const express = require('express');
const router = express.Router();
const ricezioneController = require('../controllers/ricezioneController');

router.get('/api/ricezioni', ricezioneController.getRicezioni);

module.exports = router;
