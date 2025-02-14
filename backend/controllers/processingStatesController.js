const ProcessingStates = require('../models/processingStatesModel');

// Creare un nuovo stato di lavorazione
exports.createState = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newState = new ProcessingStates({ name, description });
        await newState.save();
        res.status(201).json(newState);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Ottenere tutti gli stati di lavorazione
exports.getStates = async (req, res) => {
    try {
        const states = await ProcessingStates.find();
        res.status(200).json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aggiornare uno stato di lavorazione
exports.updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedState = await ProcessingStates.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedState);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminare uno stato di lavorazione
exports.deleteState = async (req, res) => {
    try {
        const { id } = req.params;
        await ProcessingStates.findByIdAndDelete(id);
        res.status(200).json({ message: 'State deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
