const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const assemblaggioController = {
    getAssemblaggio: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .select('assemblaggio')
                .lean();

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            res.json(lavorazione.assemblaggio);
        } catch (error) {
            res.status(500).json({
                message: "Errore nel recupero dati assemblaggio",
                error: error.message
            });
        }
    },

    updateCrudo: async (req, res) => {
        try {
            const { id } = req.params;
            const { ore, addetto, temperatura, controlliQualita } = req.body;

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { 
                    $set: {
                        'assemblaggio.crudo': {
                            ore,
                            addetto,
                            temperatura,
                            controlliQualita,
                            timestamp: new Date()
                        }
                    }
                },
                { new: true, runValidators: true }
            ).select('assemblaggio');

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            res.json(lavorazione.assemblaggio);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento fase crudo",
                error: error.message
            });
        }
    },

    updateDopoCotturaParziale: async (req, res) => {
        try {
            const { id } = req.params;
            const { ore, addetto, temperatura, controlliQualita } = req.body;

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { 
                    $set: {
                        'assemblaggio.dopoCotturaParziale': {
                            ore,
                            addetto,
                            temperatura,
                            controlliQualita,
                            timestamp: new Date()
                        }
                    }
                },
                { new: true, runValidators: true }
            ).select('assemblaggio');

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            res.json(lavorazione.assemblaggio);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento fase cottura parziale",
                error: error.message
            });
        }
    },

    updateDopoCotturaCompleta: async (req, res) => {
        try {
            const { id } = req.params;
            const { ore, addetto, temperatura, controlliQualita } = req.body;

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { 
                    $set: {
                        'assemblaggio.dopoCotturaCompleta': {
                            ore,
                            addetto,
                            temperatura,
                            controlliQualita,
                            timestamp: new Date()
                        }
                    }
                },
                { new: true, runValidators: true }
            ).select('assemblaggio');

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            res.json(lavorazione.assemblaggio);
        } catch (error) {
            res.status(500).json({
                message: "Errore nell'aggiornamento fase cottura completa",
                error: error.message
            });
        }
    },

    checkCompletamento: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .select('assemblaggio')
                .lean();

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            const { assemblaggio } = lavorazione;
            
            const fasiCompletate = {
                crudo: Boolean(assemblaggio?.crudo?.ore),
                dopoCotturaParziale: Boolean(assemblaggio?.dopoCotturaParziale?.ore),
                dopoCotturaCompleta: Boolean(assemblaggio?.dopoCotturaCompleta?.ore)
            };

            const completamentoTotale = Object.values(fasiCompletate).every(v => v);
            const percentualeCompletamento = 
                (Object.values(fasiCompletate).filter(Boolean).length / Object.keys(fasiCompletate).length) * 100;

            res.json({
                fasiCompletate,
                completamentoTotale,
                percentualeCompletamento
            });
        } catch (error) {
            res.status(500).json({
                message: "Errore nella verifica completamento",
                error: error.message
            });
        }
    }
};

module.exports = assemblaggioController;
