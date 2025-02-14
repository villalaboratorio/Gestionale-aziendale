const express = require('express');
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
    next();
};

// Routes
router.get('/', getTipoCotture);
router.get('/:id', validateObjectId, getTipoCottura);
router.post('/', createTipoCottura);
router.put('/:id', validateObjectId, updateTipoCottura);
router.delete('/:id', validateObjectId, deleteTipoCottura);

module.exports = router;
