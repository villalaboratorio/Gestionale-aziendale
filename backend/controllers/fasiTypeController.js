const FasiType = require('../models/fasiTypeModel');

// Get all fasi types
const getFasiTypes = async (req, res) => {
    try {
        const types = await FasiType.find({});
        res.status(200).json(types);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get single fasi type
const getFasiType = async (req, res) => {
    try {
        const type = await FasiType.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ message: 'Tipo non trovato' });
        }
        res.status(200).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create new fasi type
const createFasiType = async (req, res) => {
    try {
        const type = await FasiType.create(req.body);
        res.status(201).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update fasi type
const updateFasiType = async (req, res) => {
    try {
        const type = await FasiType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!type) {
            return res.status(404).json({ message: 'Tipo non trovato' });
        }
        res.status(200).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete fasi type
const deleteFasiType = async (req, res) => {
    try {
        const type = await FasiType.findByIdAndDelete(req.params.id);
        if (!type) {
            return res.status(404).json({ message: 'Tipo non trovato' });
        }
        res.status(200).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getFasiTypes,
    getFasiType,
    createFasiType,
    updateFasiType,
    deleteFasiType
};
