const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');
const Cliente = require('../../models/clienteModel');
const Ricetta = require('../../models/ricettaModel');
const TipoLavorazione = require('../../models/processingTypesModel');
const ProcessingStates = require('../../models/processingStatesModel');
const QuantityTypes = require('../../models/quantityTypesModel');
const TipoCottura = require('../../models/tipoCotturaModel');

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
            console.log(`🔍 Cercando lavorazione con ID: ${id}`);
            
            // Correzione: popolazione corretta e nidificata
            const lavorazione = await DettaglioLavorazione.findById(id)
                .populate('cliente')
                .populate('tipoLavorazione')
                .populate('statoLavorazione')
                .populate({
                    path: 'ricetta',
                    populate: {
                        path: 'cotture.tipoCottura'
                    }
                })
                .lean();

            if (!lavorazione) {
                console.log('❌ Lavorazione non trovata');
                return res.status(404).json({
                    success: false,
                    message: 'Lavorazione non trovata'
                });
            }

            // Log per debugging delle cotture nella ricetta
            console.log('Cotture nella ricetta:', 
                lavorazione.ricetta && lavorazione.ricetta.cotture ? 
                JSON.stringify(lavorazione.ricetta.cotture, null, 2) : 
                'Nessuna cottura trovata nella ricetta'
            );

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
            console.log('🔄 Avvio query parallele per collections');
            
            // Correzione: includi cotture nella selezione e popola tipoCottura
            const [clienti, ricette, tipiLavorazione, statiLavorazione, quantityTypes, tipiCottura] = await Promise.all([
                Cliente.find()
                    .select('_id nome')
                    .lean(),
                Ricetta.find()
                .populate('cotture.tipoCottura')        // Popolati i riferimenti
                    .lean(),
                TipoLavorazione.find()
                    .lean(),
                ProcessingStates.find()
                    .lean(),
                QuantityTypes.find()
                    .lean(),
                TipoCottura.find()
                    .sort('name')
                    .lean()
            ]);

            // Debug avanzato per cotture nelle ricette
            console.log('STRUTTURA COMPLETA PRIMA RICETTA:', JSON.stringify(ricette[0], null, 2));            if (ricette.length > 0 && ricette[0].cotture && ricette[0].cotture.length > 0) {
                console.log(JSON.stringify(ricette[0].cotture[0], null, 2));
            } else {
                console.log('Nessuna cottura trovata nella prima ricetta');
            }

            // Log per debugging generale
            console.log('Collections recuperate:', {
                clienti: clienti.length,
                ricette: ricette.length,
                tipiLavorazione: tipiLavorazione.length,
                statiLavorazione: statiLavorazione.length,
                quantityTypes: quantityTypes.length,
                tipiCottura: tipiCottura.length
            });

            // Inviamo la risposta con tutte le collections
            res.json({
                success: true,
                data: {
                    clienti,
                    ricette,
                    tipiLavorazione,
                    statiLavorazione,
                    quantityTypes,
                    tipiCottura
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
            console.log(`🔄 Aggiornamento lavorazione ID: ${id}`);
            console.log('Dati da aggiornare:', JSON.stringify(req.body, null, 2));
            
            // Correzione: popolazione corretta come in getInformazioniGenerali
            const updated = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate('cliente')
            .populate('tipoLavorazione')
            .populate('statoLavorazione')
            .populate({
                path: 'ricetta',
                populate: {
                    path: 'cotture.tipoCottura'
                }
            });

            if (!updated) {
                console.log('❌ Lavorazione non trovata per aggiornamento');
                return res.status(404).json({
                    success: false,
                    message: 'Lavorazione non trovata'
                });
            }

            console.log('✅ Lavorazione aggiornata con successo');
            res.json({
                success: true,
                data: updated
            });
        } catch (error) {
            console.error('❌ Errore nell\'aggiornamento:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.groupEnd();
    }
};

module.exports = informazioniGeneraliController;
