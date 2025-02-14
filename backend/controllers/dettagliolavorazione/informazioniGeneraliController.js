const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');
const Cliente = require('../../models/clienteModel');
const Ricetta = require('../../models/ricettaModel');
const TipoLavorazione = require('../../models/processingTypesModel');
const ProcessingStates = require('../../models/processingStatesModel');

// Utility per risposte standardizzate
const createResponse = (success, data = null, message = null) => ({
    success,
    ...(data && { data }),
    ...(message && { message }),
    timestamp: new Date().toISOString()
});

const informazioniGeneraliController = {
    async getInformazioniGenerali(req, res) {
        console.group('📊 Recupero dettagli lavorazione');
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .populate(['cliente', 'ricetta', 'tipoLavorazione', 'statoLavorazione'])
                .lean();

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    message: 'Lavorazione non trovata'
                });
            }

            console.log('✅ Dettagli recuperati con successo');
            res.json({
                success: true,
                data: lavorazione,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('❌ Errore:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        } finally {
            console.groupEnd();
        }
    },

    async getInitialData(req, res) {
        console.group('📚 Recupero collections');
        try {
            // Eseguiamo tutte le query in parallelo
            const [clienti, ricette, tipiLavorazione, statiLavorazione] = await Promise.all([
                Cliente.find()
                    .select('_id nome')
                    .lean(),
                Ricetta.find()
                    .select('_id nome ingredienti')
                    .lean(),
                TipoLavorazione.find()
                    .lean(),
                ProcessingStates.find()
                    .lean()
            ]);

            // Log per debugging
            console.log('Collections recuperate:', {
                clienti: clienti.length,
                ricette: ricette.length,
                tipiLavorazione: tipiLavorazione.length,
                statiLavorazione: statiLavorazione.length
            });

            // Inviamo la risposta con tutte le collections
            res.json({
                success: true,
                data: {
                    clienti,
                    ricette,
                    tipiLavorazione,
                    statiLavorazione
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Errore:', error);
            res.status(500).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } finally {
            console.groupEnd();
        }
    },

    async updateInformazioniGenerali(req, res) {
        console.group('📝 Aggiornamento lavorazione');
        try {
            const { id } = req.params;
            const updated = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                req.body,
                { 
                    new: true,
                    runValidators: true 
                }
            ).populate(['cliente', 'ricetta', 'tipoLavorazione', 'statoLavorazione']);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Lavorazione non trovata'
                });
            }

            res.json({
                success: true,
                data: updated
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.groupEnd();
    }
};

module.exports = informazioniGeneraliController;
