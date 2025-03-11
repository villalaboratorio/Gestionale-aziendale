const express = require('express');
const { dashboard,informazioniGenerali,passaggiLavorazione  } = require('../controllers/dettaglioLavorazione');
const { validateObjectId } = require('../middleware/validation');
const router = express.Router();
const dettaglioLavorazioneController = require('../controllers/dettaglioLavorazioneController');
// Logging middleware
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
    .get(simpleLog('getDashboardData'), dashboard.getDashboardData)
    .post(simpleLog('createDashboardItem'), dashboard.createDashboardItem);

router.route('/stats')
    .get(simpleLog('getDashboardStats'), dashboard.getDashboardStats);

router.route('/trends')
    .get(simpleLog('getTrends'), dashboard.getTrends);
  
    router.route('/initial-data')
    .get(simpleLog('getInitialData'), informazioniGenerali.getInitialData);


router.route('/:id')
    .all(validateObjectId)
    .get(simpleLog('getDashboardById'), dashboard.getDashboardById)
    .put(simpleLog('updateDashboard'), dashboard.updateDashboard)
    .delete(simpleLog('deleteDashboardItem'), dashboard.deleteDashboardItem);

router.route('/:id/timeline')
    .all(validateObjectId)
    .get(simpleLog('getTimeline'), dashboard.getTimeline);



router.route('/:id/avanzamento')
    .all(validateObjectId)
    .get(simpleLog('getAvanzamento'), dashboard.getAvanzamento);

 // Rotte per i passaggi di lavorazione - senza middleware
router.get('/:id/passaggi', dettaglioLavorazioneController.getPassaggiLavorazione);
router.put('/:id/passaggi', dettaglioLavorazioneController.updatePassaggiLavorazione);
router.post('/:id/passaggi', dettaglioLavorazioneController.createPassaggio);
router.delete('/:id/passaggi/:passaggioId', dettaglioLavorazioneController.deletePassaggio);
router.post('/:id/passaggi/:passaggioId/start', dettaglioLavorazioneController.startPassaggio);
router.post('/:id/passaggi/:passaggioId/complete', dettaglioLavorazioneController.completePassaggio);
router.post('/:id/passaggi/:passaggioId/note', dettaglioLavorazioneController.addNoteToPassaggio);
router.get('/:id/passaggi/status', dettaglioLavorazioneController.getPassaggiStatus);
// Route per assemblaggio
router.get('/:id/assemblaggio', dettaglioLavorazioneController.getAssemblaggio);
router.put('/:id/assemblaggio/:fase', dettaglioLavorazioneController.updateFaseAssemblaggio);
router.post('/:id/assemblaggio/:fase/start', dettaglioLavorazioneController.startFaseAssemblaggio);
router.post('/:id/assemblaggio/:fase/complete', dettaglioLavorazioneController.completeFaseAssemblaggio);
router.get('/:id/assemblaggio/status', dettaglioLavorazioneController.getAssemblaggioStatus);
//ROTTE ABBATTIMENTO
router.get('/:id/abbattimento', dettaglioLavorazioneController.getAbbattimento);
router.post('/:id/abbattimento/start', dettaglioLavorazioneController.startAbbattimento);
router.post('/:id/abbattimento/complete', dettaglioLavorazioneController.completeAbbattimento);
router.post('/:id/abbattimento/temperature-check', dettaglioLavorazioneController.registerTemperatureCheck);
router.put('/:id/abbattimento/notes', dettaglioLavorazioneController.updateNotes);
router.put('/:id/abbattimento', dettaglioLavorazioneController.updateAbbattimento); // Nuova rotta per l'aggiornamento completo
module.exports = router;