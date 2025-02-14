const Units = require('../models/unitsModel');

// GET - Recupera tutte le unità
exports.getAllUnits = async (req, res) => {
    try {
        const units = await Units.find();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero delle unità',
            error: error.message 
        });
    }
};

// GET - Recupera unità per ID
exports.getUnitById = async (req, res) => {
    try {
        const unit = await Units.findById(req.params.id);
        if (!unit) {
            return res.status(404).json({ message: 'Unità non trovata' });
        }
        res.status(200).json(unit);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero dell\'unità',
            error: error.message 
        });
    }
};

// POST - Crea nuova unità
exports.createUnit = async (req, res) => {
    try {
        const { name, abbreviation, type } = req.body;
        
        if (!name || !abbreviation || !type) {
            return res.status(400).json({ 
                message: 'Tutti i campi sono obbligatori' 
            });
        }

        const unit = new Units({
            name,
            abbreviation: abbreviation.toLowerCase(),
            type
        });

        const savedUnit = await unit.save();
        res.status(201).json(savedUnit);
    } catch (error) {
        res.status(400).json({ 
            message: 'Errore nella creazione dell\'unità',
            error: error.message 
        });
    }
};

// PUT - Aggiorna unità esistente
exports.updateUnit = async (req, res) => {
    try {
        const { name, abbreviation, type } = req.body;
        
        if (!name || !abbreviation || !type) {
            return res.status(400).json({ 
                message: 'Tutti i campi sono obbligatori' 
            });
        }

        const updatedUnit = await Units.findByIdAndUpdate(
            req.params.id,
            {
                name,
                abbreviation: abbreviation.toLowerCase(),
                type
            },
            { new: true, runValidators: true }
        );

        if (!updatedUnit) {
            return res.status(404).json({ message: 'Unità non trovata' });
        }

        res.status(200).json(updatedUnit);
    } catch (error) {
        res.status(400).json({ 
            message: 'Errore nell\'aggiornamento dell\'unità',
            error: error.message 
        });
    }
};

// DELETE - Elimina unità
exports.deleteUnit = async (req, res) => {
    try {
        const deletedUnit = await Units.findByIdAndDelete(req.params.id);
        
        if (!deletedUnit) {
            return res.status(404).json({ message: 'Unità non trovata' });
        }

        res.status(200).json({ message: 'Unità eliminata con successo' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nell\'eliminazione dell\'unità',
            error: error.message 
        });
    }
};
