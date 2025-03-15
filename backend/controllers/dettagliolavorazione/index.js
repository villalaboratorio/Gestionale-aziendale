const dashboardController = require('./dashboardController');
const cotturaController = require('./cotturaController');
const abbattimentoController = require('./abbattimentoController');
const assemblaggioController = require('./assemblaggioController');
const conservazioneController = require('./conservazioneController');
const informazioniGeneraliController = require('./informazioniGeneraliController');
const passaggiController = require('./passaggiController');

// Esportiamo direttamente i controller completi
module.exports = {
    dashboard: dashboardController,
    cottura: cotturaController,
    abbattimento: abbattimentoController,
    assemblaggio: assemblaggioController,
    conservazione: conservazioneController,
    informazioniGenerali: informazioniGeneraliController,
    passaggi: passaggiController
};
