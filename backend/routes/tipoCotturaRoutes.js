const express = require('express');
const mongoose = require('mongoose'); // Aggiungi questa riga
const router = express.Router();
const { 
    getTipoCotture, 
    getTipoCottura, 
    createTipoCottura, 
    updateTipoCottura, 
    deleteTipoCottura 
} = require('../controllers/tipoCotturaController');

// Middleware di validazione ID
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID tipo cottura non valido' });
    }
    // Nuova funzione per la versione moderna - formato ApiResponse
const getTipoCottureModern = async (req, res) => {
    try {
        const tipoCotture = await TipoCottura.find()
            .sort('name')
            .select('name description temperaturaMin temperaturaMax tempoMedioCottura');
        
        res.json({
            success: true,
            data: tipoCotture,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Errore nel recupero dei tipi cottura',
            error: error.message,
            timestamp: Date.now()
        });
    }
};
    next();
};

// Routes
router.get('/', getTipoCotture);
router.get('/:id', validateObjectId, getTipoCottura);
router.post('/', createTipoCottura);
router.put('/:id', validateObjectId, updateTipoCottura);
router.delete('/:id', validateObjectId, deleteTipoCottura);



module.exports = router;
