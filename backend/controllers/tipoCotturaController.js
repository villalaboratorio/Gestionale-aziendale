const TipoCottura = require('../models/tipoCotturaModel');

// GET - Lista tipi cottura
const getTipoCotture = async (req, res) => {
    try {
        const tipoCotture = await TipoCottura.find()
            .sort('name')
            .select('name description temperaturaMin temperaturaMax tempoMedioCottura');
        res.json(tipoCotture);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero dei tipi cottura',
            error: error.message 
        });
    }
};
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
// GET - Singolo tipo cottura
const getTipoCottura = async (req, res) => {
    try {
        const tipoCottura = await TipoCottura.findById(req.params.id);
        if (!tipoCottura) {
            return res.status(404).json({ message: 'Tipo cottura non trovato' });
        }
        res.json(tipoCottura);
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nel recupero del tipo cottura',
            error: error.message 
        });
    }
};

// POST - Crea nuovo tipo cottura
const createTipoCottura = async (req, res) => {
    try {
        const { name, description, temperaturaMin, temperaturaMax, tempoMedioCottura } = req.body;
        
        // Validazione base
        if (!name) {
            return res.status(400).json({ message: 'Nome tipo cottura obbligatorio' });
        }

        const tipoCottura = new TipoCottura({
            name,
            description,
            temperaturaMin,
            temperaturaMax,
            tempoMedioCottura
        });

        const newTipoCottura = await tipoCottura.save();
        res.status(201).json(newTipoCottura);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Tipo cottura già esistente' });
        }
        res.status(400).json({ 
            message: 'Errore nella creazione del tipo cottura',
            error: error.message 
        });
    }
};

// PUT - Aggiorna tipo cottura
const updateTipoCottura = async (req, res) => {
    try {
        const { name, description, temperaturaMin, temperaturaMax, tempoMedioCottura } = req.body;
        
        const tipoCottura = await TipoCottura.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                temperaturaMin,
                temperaturaMax,
                tempoMedioCottura
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!tipoCottura) {
            return res.status(404).json({ message: 'Tipo cottura non trovato' });
        }

        res.json(tipoCottura);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Nome tipo cottura già in uso' });
        }
        res.status(400).json({ 
            message: 'Errore nell\'aggiornamento del tipo cottura',
            error: error.message 
        });
    }
};

// DELETE - Elimina tipo cottura
const deleteTipoCottura = async (req, res) => {
    try {
        const tipoCottura = await TipoCottura.findByIdAndDelete(req.params.id);
        
        if (!tipoCottura) {
            return res.status(404).json({ message: 'Tipo cottura non trovato' });
        }

        res.json({ 
            message: 'Tipo cottura eliminato con successo',
            deletedId: tipoCottura._id 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Errore nell\'eliminazione del tipo cottura',
            error: error.message 
        });
    }
};

module.exports = {
    getTipoCotture,
    getTipoCottura,
    createTipoCottura,
    updateTipoCottura,
    deleteTipoCottura
};
