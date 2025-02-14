
const dashboardController = require('./dashboardController');
const cotturaController = require('./cotturaController');
const abbattimentoController = require('./abbattimentoController');
const assemblaggioController = require('./assemblaggioController');
const conservazioneController = require('./conservazioneController');
const informazioniGeneraliController = require('./informazioniGeneraliController');
const passaggiController = require('./passaggiController');

module.exports = {
    dashboard: {
        getDashboardData: dashboardController.getDashboardData,
        getDashboardStats: dashboardController.getDashboardStats,
        getTrends: dashboardController.getTrends,
        getFilteredDashboard: dashboardController.getFilteredDashboard,
        getDashboardLavorazioni: dashboardController.getDashboardLavorazioni,
        getDashboardById: dashboardController.getDashboardById,
        createDashboardItem: dashboardController.createDashboardItem,
        updateDashboard: dashboardController.updateDashboard,
        deleteDashboardItem: dashboardController.deleteDashboardItem,
        getTimeline: dashboardController.getTimeline,
        getAvanzamento: dashboardController.getAvanzamento
    },
    
    cottura: {
        getParametriCottura: cotturaController.getParametriCottura,
        startCottura: cotturaController.startCottura,
        registerTemperatura: cotturaController.registerTemperatura,
        completeCottura: cotturaController.completeCottura,
        addCottura: cotturaController.addCottura,
        removeCottura: cotturaController.removeCottura,
        updateCottura: cotturaController.updateCottura,
        verificaParametriHACCP: cotturaController.verificaParametriHACCP
    },

    abbattimento: {
        getAbbattimento: abbattimentoController.getAbbattimento,
        startAbbattimento: abbattimentoController.startAbbattimento,
        completeAbbattimento: abbattimentoController.completeAbbattimento,
        registerTemperatureCheck: abbattimentoController.registerTemperatureCheck,
        updateNotes: abbattimentoController.updateNotes
    },

    assemblaggio: {
        getAssemblaggio: assemblaggioController.getAssemblaggio,
        updateCrudo: assemblaggioController.updateCrudo,
        updateDopoCotturaParziale: assemblaggioController.updateDopoCotturaParziale,
        updateDopoCotturaCompleta: assemblaggioController.updateDopoCotturaCompleta,
        checkCompletamento: assemblaggioController.checkCompletamento
    },

    conservazione: {
        getConservazione: conservazioneController.getConservazione,
        updateImballaggio: conservazioneController.updateImballaggio,
        updateMetodo: conservazioneController.updateMetodo,
        updateParametri: conservazioneController.updateParametri,
        registerVerificaImballaggio: conservazioneController.registerVerificaImballaggio,
        calcolaScadenza: conservazioneController.calcolaScadenza
    },

    informazioniGenerali: {
        getInitialData: informazioniGeneraliController.getInitialData,
        getInformazioniGenerali: informazioniGeneraliController.getInformazioniGenerali,
        updateInformazioniGenerali: informazioniGeneraliController.updateInformazioniGenerali
    },

    passaggi: {
        getPassaggi: passaggiController.getPassaggi,
        addPassaggio: passaggiController.addPassaggio,
        updatePassaggio: passaggiController.updatePassaggio,
        deletePassaggio: passaggiController.deletePassaggio
    }
};