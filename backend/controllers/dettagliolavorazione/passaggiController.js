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
        updateNotes: abbattimentoController.updateNotes,
        updateAbbattimento: abbattimentoController.updateAbbattimento,
        deleteAbbattimento: abbattimentoController.deleteAbbattimento,
        validateAbbattimento: abbattimentoController.validateAbbattimento,
        getAbbattimentoStats: abbattimentoController.getAbbattimentoStats
    },

    assemblaggio: {
        getAssemblaggio: assemblaggioController.getAssemblaggio,
        updateFaseAssemblaggio: assemblaggioController.updateFaseAssemblaggio,
        startFaseAssemblaggio: assemblaggioController.startFaseAssemblaggio,
        completeFaseAssemblaggio: assemblaggioController.completeFaseAssemblaggio,
        getAssemblaggioStatus: assemblaggioController.getAssemblaggioStatus
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
        getPassaggiLavorazione: passaggiController.getPassaggiLavorazione,
        updatePassaggiLavorazione: passaggiController.updatePassaggiLavorazione,
        startPassaggio: passaggiController.startPassaggio,
        completePassaggio: passaggiController.completePassaggio,
        addNote: passaggiController.addNote,
        createPassaggio: passaggiController.createPassaggio,
        calculatePassaggiStatus: passaggiController.calculatePassaggiStatus,
        deletePassaggio: passaggiController.deletePassaggio
    }
};
