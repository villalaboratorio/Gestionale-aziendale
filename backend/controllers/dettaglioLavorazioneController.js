// Importiamo i controller specializzati
const dashboardController = require('./dettaglioLavorazione/dashboardController');
const cotturaController = require('./dettaglioLavorazione/cotturaController');
const abbattimentoController = require('./dettaglioLavorazione/abbattimentoController');
const assemblaggioController = require('./dettaglioLavorazione/assemblaggioController');
const conservazioneController = require('./dettaglioLavorazione/conservazioneController');
const informazioniGeneraliController = require('./dettaglioLavorazione/informazioniGeneraliController');
const passaggiController = require('./dettaglioLavorazione/passaggiController');

// Esportiamo i controller con la struttura gerarchica richiesta dalle routes
module.exports = {
    // Controller Dashboard
    dashboard: dashboardController,
    
    // Controller Cottura
    cottura: cotturaController,
    
    // Controller Abbattimento
    abbattimento: abbattimentoController,
    
    // Controller Assemblaggio
    assemblaggio: assemblaggioController,
    
    // Controller Conservazione
    conservazione: conservazioneController,
    
    // Controller Informazioni Generali
    informazioniGenerali: informazioniGeneraliController,
    
    // Controller Passaggi Lavorazione
    passaggi: passaggiController,
    
    // Funzioni di utilità per il controller principale
    getInformazioniGenerali: async (req, res) => {
        try {
            // Passa req e res al metodo getInitialData
            await informazioniGeneraliController.getInitialData(req, res);
            // Non serve fare res.json qui perché lo farà già getInitialData
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    
    // Funzioni per passaggi di lavorazione
    getPassaggiLavorazione: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await passaggiController.getPassaggiLavorazione(id);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    updatePassaggiLavorazione: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await passaggiController.updatePassaggiLavorazione(id, req.body.passaggi);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    createPassaggio: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await passaggiController.createPassaggio(id);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    deletePassaggio: async (req, res) => {
        try {
            const { id, passaggioId } = req.params;
            const result = await passaggiController.deletePassaggio(id, passaggioId);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    startPassaggio: async (req, res) => {
        try {
            const { id, passaggioId } = req.params;
            const { tipoOperazione, operatore } = req.body;
            const result = await passaggiController.startPassaggio(id, passaggioId, tipoOperazione, operatore);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    completePassaggio: async (req, res) => {
        try {
            const { id, passaggioId } = req.params;
            const { tipoOperazione } = req.body;
            const result = await passaggiController.completePassaggio(id, passaggioId, tipoOperazione);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    addNoteToPassaggio: async (req, res) => {
        try {
            const { id, passaggioId } = req.params;
            const { tipoOperazione, note } = req.body;
            const result = await passaggiController.addNote(id, passaggioId, tipoOperazione, note);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    getPassaggiStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await passaggiController.calculatePassaggiStatus(id);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    // Funzioni per assemblaggio
    getAssemblaggio: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await assemblaggioController.getAssemblaggio(id);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    updateFaseAssemblaggio: async (req, res) => {
        try {
            const { id, fase } = req.params;
            const result = await assemblaggioController.updateFaseAssemblaggio(id, fase, req.body);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    startFaseAssemblaggio: async (req, res) => {
        try {
            const { id, fase } = req.params;
            const { addetto } = req.body;
            const result = await assemblaggioController.startFaseAssemblaggio(id, fase, addetto);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    completeFaseAssemblaggio: async (req, res) => {
        try {
            const { id, fase } = req.params;
            const result = await assemblaggioController.completeFaseAssemblaggio(id, fase, req.body);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    getAssemblaggioStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await assemblaggioController.getAssemblaggioStatus(id);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
    
    // Funzioni per abbattimento
    getAbbattimento: abbattimentoController.getAbbattimento,
    startAbbattimento: abbattimentoController.startAbbattimento,
    completeAbbattimento: abbattimentoController.completeAbbattimento,
    registerTemperatureCheck: abbattimentoController.registerTemperatureCheck,
    updateNotes: abbattimentoController.updateNotes,
    updateAbbattimento: abbattimentoController.updateAbbattimento,
    
    // Funzioni per cottura
    getParametriCottura: cotturaController.getParametriCottura,
    addCottura: cotturaController.addCottura,
    updateCottura: cotturaController.updateCottura,
    startCottura: cotturaController.startCottura,
    completeCottura: cotturaController.completeCottura,
    removeCottura: cotturaController.removeCottura,
    
    // Funzioni per conservazione
    getConservazione: conservazioneController.getConservazione,
    updateImballaggio: conservazioneController.updateImballaggio,
    updateMetodo: conservazioneController.updateMetodo,
    updateParametri: conservazioneController.updateParametri,
    registerVerificaImballaggio: conservazioneController.registerVerificaImballaggio,
    calcolaScadenza: conservazioneController.calcolaScadenza
};

