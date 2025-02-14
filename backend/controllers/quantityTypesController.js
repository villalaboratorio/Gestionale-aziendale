const QuantityTypes = require('../models/quantityTypesModel');

// Creare una nuova tipologia di quantità
exports.createQuantityType = async (req, res) => {
    try {
        const { name, abbreviation, description } = req.body;
        const newQuantityType = new QuantityTypes({ name, abbreviation, description });
        await newQuantityType.save();
        res.status(201).json(newQuantityType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Ottenere tutte le tipologie di quantità
exports.getQuantityTypes = async (req, res) => {
    try {
        const quantityTypes = await QuantityTypes.find();
        res.status(200).json(quantityTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aggiornare una tipologia di quantità
exports.updateQuantityType = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedQuantityType = await QuantityTypes.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedQuantityType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminare una tipologia di quantità
exports.deleteQuantityType = async (req, res) => {
    try {
        const { id } = req.params;
        await QuantityTypes.findByIdAndDelete(id);
        res.status(200).json({ message: 'Quantity Type deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
