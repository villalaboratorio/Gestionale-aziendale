const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const lavorazioniController = {
    getLavorazioni: async (req, res) => {
        try {
            const lavorazioni = await DettaglioLavorazione.find()
                .populate('cliente')
                .populate('ricetta')
                .populate('statoLavorazione');
            res.json(lavorazioni);
        } catch (error) {
            res.status(500).json({
                message: "Errore nel recupero lavorazioni",
                error: error.message
            });
        }
    },

    getLavorazioneById: async (req, res) => {
        try {
            const lavorazione = await DettaglioLavorazione.findById(req.params.id)
                .populate('cliente')
                .populate('ricetta')
                .populate('statoLavorazione');
            
            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }
            
            res.json(lavorazione);
        } catch (error) {
            res.status(500).json({
                message: "Errore nel recupero della lavorazione",
                error: error.message
            });
        }
    },

    createLavorazione: async (req, res) => {
        try {
            const nuovaLavorazione = new DettaglioLavorazione(req.body);
            await nuovaLavorazione.save();
            res.status(201).json(nuovaLavorazione);
        } catch (error) {
            res.status(400).json({
                message: "Errore nella creazione lavorazione",
                error: error.message
            });
        }
    },

    updateLavorazione: async (req, res) => {
        try {
            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(lavorazione);
        } catch (error) {
            res.status(400).json({
                message: "Errore nell'aggiornamento",
                error: error.message
            });
        }
    },

    deleteLavorazione: async (req, res) => {
        try {
            await DettaglioLavorazione.findByIdAndDelete(req.params.id);
            res.json({ message: "Lavorazione eliminata con successo" });
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'eliminazione",
                error: error.message
            });
        }
    },

    // Timeline e Avanzamento
    getTimeline: async (req, res) => {
        // Implementazione getTimeline
    },
    
    getAvanzamento: async (req, res) => {
        // Implementazione getAvanzamento
    },

    // Note e Verifiche
    addNote: async (req, res) => {
        // Implementazione addNote
    },
    
    updateNote: async (req, res) => {
        // Implementazione updateNote
    },
    
    deleteNote: async (req, res) => {
        // Implementazione deleteNote
    },
    
    getVerificheHACCP: async (req, res) => {
        // Implementazione getVerificheHACCP
    },
    
    addVerificaHACCP: async (req, res) => {
        // Implementazione addVerificaHACCP
    }
};

module.exports = lavorazioniController;
