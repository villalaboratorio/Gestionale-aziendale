const express = require('express');
const router = express.Router();
const {
    getFasiMethods,
    getFasiMethod,
    createFasiMethod,
    updateFasiMethod,
    deleteFasiMethod
} = require('../controllers/fasiMethodController');

// GET all methods
router.get('/', getFasiMethods);

// GET single method
router.get('/:id', getFasiMethod);

// POST new method
router.post('/', createFasiMethod);

// PUT update method
router.put('/:id', updateFasiMethod);

// DELETE method
router.delete('/:id', deleteFasiMethod);

module.exports = router;
