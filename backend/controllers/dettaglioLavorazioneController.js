const DettaglioLavorazione = require('../models/dettaglioLavorazioneModel');
const Cliente = require('../models/clienteModel');
const Ricetta = require('../models/ricettaModel');
const TipoLavorazione = require('../models/processingTypesModel');
const {
    dashboard,
    cottura,
    abbattimento,
    assemblaggio,
    conservazione,
    informazioniGenerali
} = require('./dettaglioLavorazione');

// Utility function for standardized responses
const createResponse = (success, data = null, message = null) => ({
    success,
    ...(data && { data }),
    ...(message && { message }),
    timestamp: new Date().toISOString()
});

const dettaglioLavorazioneController = {
    async getInformazioniGenerali(req, res) {
        console.group('🔍 Elaborazione getInformazioniGenerali');
        const { id } = req.params;

        try {
            const lavorazione = await informazioniGenerali.getLavorazioneDetails(id);
            const dashboardInfo = await dashboard.getDashboardData(id);

            const responseData = {
                ...lavorazione,
                dashboardMetrics: dashboardInfo
            };

            console.log('✅ Dati elaborati con successo');
            res.json(createResponse(true, responseData));
        } catch (error) {
            console.error('❌ Errore:', error);
            res.status(500).json(createResponse(false, null, error.message));
        } finally {
            console.groupEnd();
        }
    },

    async getCollections(req, res) {
        try {
            const collections = await informazioniGenerali.getAllCollections();
            res.json(createResponse(true, collections));
        } catch (error) {
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async createLavorazione(req, res) {
        try {
            // Genera numeroScheda
            const currentYear = new Date().getFullYear();
            const lastLavorazione = await DettaglioLavorazione
                .findOne({ numeroScheda: new RegExp(`LAV-${currentYear}-`) })
                .sort({ numeroScheda: -1 });

            let nextNumber = 1;
            if (lastLavorazione) {
                const lastNumber = parseInt(lastLavorazione.numeroScheda.split('-')[2]);
                nextNumber = lastNumber + 1;
            }
        
            const numeroScheda = `LAV-${currentYear}-${String(nextNumber).padStart(3, '0')}`;

            // Crea nuova lavorazione con numeroScheda generato
            const nuovaLavorazione = new DettaglioLavorazione({
                ...req.body,
                numeroScheda
            });

            const lavorazioneSalvata = await nuovaLavorazione.save();
        
            const lavorazionePopolata = await DettaglioLavorazione.findById(lavorazioneSalvata._id)
                .populate([
                    { path: 'cliente', select: 'nome riferimento' },
                    { path: 'ricetta', select: 'nome codice' },
                    { path: 'tipoLavorazione', select: 'name description' },
                    { path: 'statoLavorazione', select: 'name description' }
                ]);

            await dashboard.updateDashboardStats(lavorazioneSalvata._id);

            res.status(201).json(createResponse(true, lavorazionePopolata));
        } catch (error) {
            res.status(400).json(createResponse(false, null, error.message));
        }
    },
    async updateLavorazione(req, res) {
        const { id } = req.params;
        try {
            const updatedLavorazione = await informazioniGenerali.updateLavorazione(id, req.body);
            if (!updatedLavorazione) {
                return res.status(404).json(createResponse(false, null, 'Lavorazione non trovata'));
            }

            // Aggiorna i dati correlati
            await Promise.all([
                dashboard.updateDashboardStats(id),
                cottura.updateCotturaStatus(id),
                abbattimento.updateAbbattimentoStatus(id)
            ]);

            res.json(createResponse(true, updatedLavorazione));
        } catch (error) {
            res.status(400).json(createResponse(false, null, error.message));
        }
    },

    async deleteLavorazione(req, res) {
        const { id } = req.params;
        try {
            const result = await informazioniGenerali.deleteLavorazione(id);
            if (!result) {
                return res.status(404).json(createResponse(false, null, 'Lavorazione non trovata'));
            }

            // Cleanup correlato
            await Promise.all([
                dashboard.removeDashboardEntry(id),
                cottura.deleteCotturaData(id),
                abbattimento.deleteAbbattimentoData(id)
            ]);

            res.json(createResponse(true, null, 'Lavorazione eliminata con successo'));
        } catch (error) {
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async updateStatoLavorazione(req, res) {
        const { id } = req.params;
        const { stato } = req.body;

        try {
            const updatedLavorazione = await informazioniGenerali.updateStatoLavorazione(id, stato);
            if (!updatedLavorazione) {
                return res.status(404).json(createResponse(false, null, 'Lavorazione non trovata'));
            }

            // Aggiorna stati correlati
            await Promise.all([
                dashboard.updateProcessingState(id, stato),
                cottura.handleStateChange(id, stato),
                abbattimento.handleStateChange(id, stato)
            ]);

            res.json(createResponse(true, updatedLavorazione));
        } catch (error) {
            res.status(400).json(createResponse(false, null, error.message));
        }
    }
};

module.exports = dettaglioLavorazioneController;
