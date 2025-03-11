// Importa i singoli controller con i nomi file corretti
const statisticsController = require('./dashboard/statisticsController');
const scheduleController = require('./dashboard/scheduleController');
const materiePrimeController = require('./dashboard/materiePrimeController');
const lavorazioniController = require('./dashboard/lavorazioniController');
const kpiController = require('./dashboard/kpiController');

// Ri-esporta tutti i metodi dagli altri controller
module.exports = {
  // Statistiche generali
  getDashboardStatistics: statisticsController.getDashboardStatistics,
  
  // Eventi pianificati
  getScheduledEvents: scheduleController.getScheduledEvents,
  
  // Statistiche materie prime
  getMateriePrimeStats: materiePrimeController.getMateriePrimeStats,
  
  // Lavorazioni
  getRecentLavorazioni: lavorazioniController.getRecentLavorazioni,
  getDashboardLavorazioni: lavorazioniController.getDashboardLavorazioni,
  
  // KPI
  getKPIs: kpiController.getKPIs
};
