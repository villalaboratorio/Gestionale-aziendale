const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

console.log("dashboardController methods:", Object.keys(dashboardController));

// Importa direttamente il controller per bypassare il problema
const directController = require('../controllers/dashboard/lavorazioniController');
console.log("Direct controller methods:", Object.keys(directController));
// Rotte della dashboard
router.get('/statistics', dashboardController.getDashboardStatistics);
router.get('/schedule', dashboardController.getScheduledEvents);
router.get('/materie-prime/stats', dashboardController.getMateriePrimeStats);
router.get('/recent-lavorazioni', dashboardController.getRecentLavorazioni);
router.get('/kpis', dashboardController.getKPIs);
router.get('/dashboard-lavorazioni', dashboardController.getDashboardLavorazioni);
module.exports = router;