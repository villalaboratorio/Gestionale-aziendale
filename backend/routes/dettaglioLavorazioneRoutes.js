const express = require('express');
const { 
    dashboard, 
    informazioniGenerali, 
    cottura, 
    abbattimento, 
    assemblaggio, 
    conservazione,
    passaggi
} = require('../controllers/dettaglioLavorazione/index.js');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Definiamo il nuovo sistema di logging
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

// Aggiorniamo le route usando simpleLog invece di simpleLog
router.route('/dashboard')
    .get(simpleLog('getDashboardData'), dashboard.getDashboardData)
    .post(simpleLog('createDashboardItem'), dashboard.createDashboardItem);

router.route('/dashboard/stats')
    .get(simpleLog('getDashboardStats'), dashboard.getDashboardStats);

router.route('/dashboard/trends')
    .get(simpleLog('getTrends'), dashboard.getTrends);
// 2. Rotte Informazioni Generali
router.route('/initial-data')
    .get(simpleLog('getInitialData'), informazioniGenerali.getInitialData);

router.route('/:id/informazioni-generali')
    .all(validateObjectId)
    .get(simpleLog('getInformazioniGenerali'), informazioniGenerali.getInformazioniGenerali)
    .put(simpleLog('updateInformazioniGenerali'), informazioniGenerali.updateInformazioniGenerali);

// 3. Rotte Cottura
// Routes per la gestione cottura
router.route('/:id/cotture')
    .all(validateObjectId)
    .get(simpleLog('getParametriCottura'), cottura.getParametriCottura)
    .post(simpleLog('addCottura'), cottura.addCottura);

router.route('/:id/cotture/:cotturaId')
    .all(validateObjectId)
    .delete(simpleLog('removeCottura'), cottura.removeCottura);

router.route('/:id/cotture/start')
    .all(validateObjectId)
    .post(simpleLog('startCottura'), cottura.startCottura);

router.route('/:id/cotture/complete')
    .all(validateObjectId)
    .post(simpleLog('completeCottura'), cottura.completeCottura);

    router.route('/:id/cotture/:cotturaId')
        .all(validateObjectId)
        .delete(simpleLog('removeCottura'), cottura.removeCottura)
        .put(simpleLog('updateCottura'), cottura.updateCottura);
// 4. Rotte Abbattimento
router.route('/:id/abbattimento')
    .all(validateObjectId)
    .get(simpleLog('getAbbattimento'), abbattimento.getAbbattimento);

router.route('/:id/abbattimento/start')
    .all(validateObjectId)
    .post(simpleLog('startAbbattimento'), abbattimento.startAbbattimento);

// 5. Rotte Assemblaggio
router.route('/:id/assemblaggio')
    .all(validateObjectId)
    .get(simpleLog('getAssemblaggio'), assemblaggio.getAssemblaggio);

router.route('/:id/assemblaggio/crudo')
    .all(validateObjectId)
    .put(simpleLog('updateCrudo'), assemblaggio.updateCrudo);

// 6. Rotte Conservazione
router.route('/:id/conservazione')
    .all(validateObjectId)
    .get(simpleLog('getConservazione'), conservazione.getConservazione);

router.route('/:id/conservazione/imballaggio')
    .all(validateObjectId)
    .put(simpleLog('updateImballaggio'), conservazione.updateImballaggio);

// 7. Rotte CRUD base
router.route('/')
    .get(simpleLog('getDashboardLavorazioni'), dashboard.getDashboardLavorazioni)
    .post(simpleLog('createDashboardItem'), dashboard.createDashboardItem);

router.route('/:id')
    .all(validateObjectId)
    .get(simpleLog('getDashboardById'), dashboard.getDashboardById)
    .put(simpleLog('updateDashboard'), dashboard.updateDashboard)
    .delete(simpleLog('deleteDashboardItem'), dashboard.deleteDashboardItem);
    router.get('/:id/passaggi', passaggi.getPassaggi);
    router.post('/:id/passaggi', passaggi.addPassaggio);
    router.put('/:id/passaggi/:passaggioId', passaggi.updatePassaggio);
    router.delete('/:id/passaggi/:passaggioId', passaggi.deletePassaggio);
    
    
module.exports = router;





