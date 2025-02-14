const express = require('express');
const router = express.Router();
const {
    getFasiTypes,
    getFasiType,
    createFasiType,
    updateFasiType,
    deleteFasiType
} = require('../controllers/fasiTypeController');

router.get('/', getFasiTypes);
router.get('/:id', getFasiType);
router.post('/', createFasiType);
router.put('/:id', updateFasiType);
router.delete('/:id', deleteFasiType);

module.exports = router;
