const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const abbattimentoController = {
    // Recupera dati abbattimento
    getAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .select('abbattimento');

            res.json(lavorazione.abbattimento);
        } catch (error) {
            res.status(500).json({
                message: "Errore nel recupero dati abbattimento",
                error: error.message
            });
        }
    },

    // Avvia ciclo abbattimento
    startAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const { temperaturaIniziale, addetto } = req.body;

            const update = {
                'abbattimento.inizio': new Date(),
                'abbattimento.temperaturaIniziale': temperaturaIniziale,
                'abbattimento.addetto': addetto
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(lavorazione.abbattimento);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'avvio abbattimento",
                error: error.message
            });
        }
    },

    // Completa ciclo abbattimento
    completeAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const { temperaturaFinale } = req.body;

            const lavorazione = await DettaglioLavorazione.findById(id);
            const tempoTotale = (new Date() - new Date(lavorazione.abbattimento.inizio)) / 1000 / 60; // in minuti

            const update = {
                'abbattimento.fine': new Date(),
                'abbattimento.temperaturaFinale': temperaturaFinale,
                'abbattimento.tempoTotale': tempoTotale
            };

            const updated = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(updated.abbattimento);
        } catch (error) {
            res.status(500).json({
                message: "Errore nel completamento abbattimento",
                error: error.message
            });
        }
    },

    // Registra verifica temperatura
    registerTemperatureCheck: async (req, res) => {
        try {
            const { id } = req.params;
            const { temperatura, responsabileVerifica } = req.body;

            const update = {
                'abbattimento.verificaTemperatura': true,
                'abbattimento.responsabileVerifica': responsabileVerifica
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(lavorazione.abbattimento);
        } catch (error) {
            res.status(500).json({
                message: "Errore nella registrazione verifica temperatura",
                error: error.message
            });
        }
    },

    // Aggiorna note abbattimento
    updateNotes: async (req, res) => {
        try {
            const { id } = req.params;
            const { note } = req.body;

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: { 'abbattimento.note': note } },
                { new: true }
            );

            res.json(lavorazione.abbattimento);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento note",
                error: error.message
            });
        }
    }
};

module.exports = abbattimentoController;
