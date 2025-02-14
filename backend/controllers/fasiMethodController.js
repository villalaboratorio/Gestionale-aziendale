const FasiMethod = require('../models/fasiMethodModel');

// Get all fasi methods
const getFasiMethods = async (req, res) => {
    try {
        const methods = await FasiMethod.find({});
        res.status(200).json(methods);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get single fasi method
const getFasiMethod = async (req, res) => {
    try {
        const method = await FasiMethod.findById(req.params.id);
        if (!method) {
            return res.status(404).json({ message: 'Metodo non trovato' });
        }
        res.status(200).json(method);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create new fasi method
const createFasiMethod = async (req, res) => {
    try {
        const method = await FasiMethod.create(req.body);
        res.status(201).json(method);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update fasi method
const updateFasiMethod = async (req, res) => {
    try {
        const method = await FasiMethod.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!method) {
            return res.status(404).json({ message: 'Metodo non trovato' });
        }
        res.status(200).json(method);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete fasi method
const deleteFasiMethod = async (req, res) => {
    try {
        const method = await FasiMethod.findByIdAndDelete(req.params.id);
        if (!method) {
            return res.status(404).json({ message: 'Metodo non trovato' });
        }
        res.status(200).json(method);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getFasiMethods,
    getFasiMethod,
    createFasiMethod,
    updateFasiMethod,
    deleteFasiMethod
};
