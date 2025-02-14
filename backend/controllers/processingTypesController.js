const ProcessingTypes = require('../models/processingTypesModel');

// Ottenere tutti i tipi di lavorazione
exports.getProcessingTypes = async (req, res) => {
    try {
        const processingTypes = await ProcessingTypes.find();
        res.status(200).json(processingTypes);
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error });
    }
};

// Creare un nuovo tipo di lavorazione
exports.createProcessingType = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newProcessingType = new ProcessingTypes({ name, description });
        await newProcessingType.save();
        res.status(201).json(newProcessingType);
    } catch (error) {
        res.status(400).json({ message: 'Errore nella creazione del tipo di lavorazione', error });
    }
};

// Aggiornare un tipo di lavorazione esistente
exports.updateProcessingType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedProcessingType = await ProcessingTypes.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedProcessingType) {
            return res.status(404).json({ message: 'Tipo di lavorazione non trovato' });
        }

        res.status(200).json(updatedProcessingType);
    } catch (error) {
        res.status(400).json({ message: 'Errore nell\'aggiornamento del tipo di lavorazione', error });
    }
};

// Eliminare un tipo di lavorazione esistente
exports.deleteProcessingType = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProcessingType = await ProcessingTypes.findByIdAndDelete(id);

        if (!deletedProcessingType) {
            return res.status(404).json({ message: 'Tipo di lavorazione non trovato' });
        }

        res.status(200).json({ message: 'Tipo di lavorazione eliminato con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore del server', error });
    }
};
