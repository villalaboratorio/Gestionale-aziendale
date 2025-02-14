const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const conservazioneController = {
    // Recupera dati conservazione
    getConservazione: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .select('conservazione');

            res.json(lavorazione.conservazione);
        } catch (error) {
            res.status(500).json({
                message: "Errore nel recupero dati conservazione",
                error: error.message
            });
        }
    },

    // Aggiorna imballaggio
    updateImballaggio: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                plastica, 
                carta, 
                acciaio, 
                vetro, 
                alluminio, 
                sottovuoto, 
                altro 
            } = req.body;

            const update = {
                'conservazione.imballaggio': {
                    plastica,
                    carta,
                    acciaio,
                    vetro,
                    alluminio,
                    sottovuoto,
                    altro
                }
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(lavorazione.conservazione);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento imballaggio",
                error: error.message
            });
        }
    },

    // Aggiorna metodo conservazione
    updateMetodo: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                acqua, 
                liquidoGoverno, 
                agro, 
                olio, 
                altro 
            } = req.body;

            const update = {
                'conservazione.metodo': {
                    acqua,
                    liquidoGoverno,
                    agro,
                    olio,
                    altro
                }
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(lavorazione.conservazione);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento metodo",
                error: error.message
            });
        }
    },

    // Aggiorna parametri conservazione
    updateParametri: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                temperatura, 
                inizio, 
                fine, 
                cella,
                shelf_life,
                condizioni,
                note 
            } = req.body;

            const update = {
                'conservazione.temperatura': temperatura,
                'conservazione.inizio': inizio,
                'conservazione.fine': fine,
                'conservazione.cella': cella,
                'conservazione.shelf_life': shelf_life,
                'conservazione.condizioni': condizioni,
                'conservazione.note': note
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(lavorazione.conservazione);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento parametri",
                error: error.message
            });
        }
    },

    // Registra verifica imballaggio
    registerVerificaImballaggio: async (req, res) => {
        try {
            const { id } = req.params;
            const { verificaImballaggio, responsabileVerifica } = req.body;

            const update = {
                'conservazione.verificaImballaggio': verificaImballaggio,
                'conservazione.responsabileVerifica': responsabileVerifica
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            );

            res.json(lavorazione.conservazione);
        } catch (error) {
            res.status(500).json({
                message: "Errore nella registrazione verifica",
                error: error.message
            });
        }
    },

    // Calcola scadenza
    calcolaScadenza: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .select('conservazione');

            const { inizio, shelf_life } = lavorazione.conservazione;
            if (!inizio || !shelf_life) {
                throw new Error('Dati insufficienti per il calcolo della scadenza');
            }

            const dataScadenza = new Date(inizio);
            dataScadenza.setDate(dataScadenza.getDate() + shelf_life);

            res.json({ dataScadenza });
        } catch (error) {
            res.status(500).json({
                message: "Errore nel calcolo della scadenza",
                error: error.message
            });
        }
    }
};

module.exports = conservazioneController;
