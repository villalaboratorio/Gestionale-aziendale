const express = require('express');
const router = express.Router();
const controller = require('../controllers/dettaglioLavorazioneController');
const { validateObjectId } = require('../middleware/validation');

// Middleware di logging
const simpleLog = (operation) => {
    return (req, res, next) => {
        console.group(`🎯 API Call: ${operation}`);
        console.log('URL:', req.url);
        console.log('Method:', req.method);
        console.log('Query:', req.query);
        console.groupEnd();
        next();
    };
};



// Dashboard routes
router.route('/')
    .get(simpleLog('getDashboardData'), controller.dashboard.getDashboardData)
    .post(simpleLog('createDashboardItem'), controller.dashboard.createDashboardItem);

router.route('/stats')
    .get(simpleLog('getDashboardStats'), controller.dashboard.getDashboardStats);

router.route('/trends')
    .get(simpleLog('getTrends'), controller.dashboard.getTrends);

router.route('/initial-data')
    .get(simpleLog('getInitialData'), controller.getInformazioniGenerali);

router.route('/:id')
    .all(validateObjectId)
    .get(simpleLog('getDashboardById'), controller.dashboard.getDashboardById)
    .put(simpleLog('updateDashboard'), controller.dashboard.updateDashboard)
    .delete(simpleLog('deleteDashboardItem'), controller.dashboard.deleteDashboardItem);

router.route('/:id/timeline')
    .all(validateObjectId)
    .get(simpleLog('getTimeline'), controller.dashboard.getTimeline);

router.route('/:id/avanzamento')
    .all(validateObjectId)
    .get(simpleLog('getAvanzamento'), controller.dashboard.getAvanzamento);

// Rotte per i passaggi di lavorazione
router.get('/:id/passaggi', controller.getPassaggiLavorazione);
router.put('/:id/passaggi', controller.updatePassaggiLavorazione);
router.post('/:id/passaggi', controller.createPassaggio);
router.delete('/:id/passaggi/:passaggioId', controller.deletePassaggio);
router.post('/:id/passaggi/:passaggioId/start', controller.startPassaggio);
router.post('/:id/passaggi/:passaggioId/complete', controller.completePassaggio);
router.post('/:id/passaggi/:passaggioId/note', controller.addNoteToPassaggio);
router.get('/:id/passaggi/status', controller.getPassaggiStatus);

// Rotte per assemblaggio
router.get('/:id/assemblaggio', controller.getAssemblaggio);
router.put('/:id/assemblaggio/:fase', controller.updateFaseAssemblaggio);
router.post('/:id/assemblaggio/:fase/start', controller.startFaseAssemblaggio);
router.post('/:id/assemblaggio/:fase/complete', controller.completeFaseAssemblaggio);
router.get('/:id/assemblaggio/status', controller.getAssemblaggioStatus);

// Rotte per abbattimento
router.get('/:id/abbattimento', controller.getAbbattimento);
router.post('/:id/abbattimento/start', controller.startAbbattimento);
router.post('/:id/abbattimento/complete', controller.completeAbbattimento);
router.post('/:id/abbattimento/temperature-check', controller.registerTemperatureCheck);
router.put('/:id/abbattimento/notes', controller.updateNotes);
router.put('/:id/abbattimento', controller.updateAbbattimento);

// Rotte per cottura
router.get('/:id/cottura', controller.getParametriCottura);
router.post('/:id/cottura', controller.addCottura);
router.put('/:id/cottura/:cotturaId', controller.updateCottura);
router.post('/:id/cottura/start', controller.startCottura);
router.post('/:id/cottura/complete', controller.completeCottura);
router.delete('/:id/cottura/:cotturaId', controller.removeCottura);

// Rotte per conservazione
router.get('/:id/conservazione', controller.getConservazione);
router.put('/:id/conservazione/imballaggio', controller.updateImballaggio);
router.put('/:id/conservazione/metodo', controller.updateMetodo);
router.put('/:id/conservazione/parametri', controller.updateParametri);
router.post('/:id/conservazione/verifica', controller.registerVerificaImballaggio);
router.get('/:id/conservazione/scadenza', controller.calcolaScadenza);

module.exports = router;
