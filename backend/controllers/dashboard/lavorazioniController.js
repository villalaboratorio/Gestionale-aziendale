const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');
const mongoose = require('mongoose');

/**
 * Recupera riepilogo lavorazioni recenti per la dashboard
 */
exports.getRecentLavorazioni = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Recupera le lavorazioni più recenti
    const lavorazioniRecenti = await DettaglioLavorazione.find()
      .populate('cliente', 'nome')
      .populate('ricetta', 'nome')
      .populate('statoLavorazione', 'nome codice')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .lean()
      .exec();
    
    // Trasforma i dati in un formato più adatto al frontend
    const recentItems = lavorazioniRecenti.map(lav => ({
      _id: lav._id,
      numeroScheda: lav.numeroScheda,
      cliente: lav.cliente?.nome || 'N/D',
      ricetta: lav.ricetta?.nome || 'N/D',
      stato: lav.statoLavorazione?.codice || 'unknown',
      dataConsegna: lav.dataConsegnaPrevista,
      giorniRimanenti: lav.dataConsegnaPrevista ? 
        Math.ceil((new Date(lav.dataConsegnaPrevista) - new Date()) / (1000 * 60 * 60 * 24)) : 
        null,
      operatore: lav.operatore || 'Non assegnato',
      isUrgente: lav.isUrgente || false,
      detailsUrl: `/v2/lavorazione/${lav._id}`
    }));
    
    res.json({
      success: true,
      data: recentItems,
      message: 'Lavorazioni recenti recuperate con successo'
    });
  } catch (error) {
    console.error('Errore durante il recupero delle lavorazioni recenti:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero delle lavorazioni recenti',
      error: error.message
    });
  }
};

/**
 * Recupera le lavorazioni per la dashboard, filtrate per stato
 */
exports.getDashboardLavorazioni = async (req, res) => {
  try {
    const { stato, limit = 10 } = req.query;
    
    console.log("getDashboardLavorazioni chiamato con stato:", stato);

    // Costruisci la query di base
    let query = {};
    
    // Recupera tutte le lavorazioni e poi filtrale in memoria
    const lavorazioni = await DettaglioLavorazione.find(query)
      .populate('cliente', 'nome')
      .populate('ricetta', 'nome')
      .populate('statoLavorazione', 'nome codice')
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
    
    console.log(`Trovate ${lavorazioni.length} lavorazioni totali`);
    
    // Filtra le lavorazioni in base allo stato richiesto (se specificato)
    let lavorazioniFiltrate = lavorazioni;
    
    if (stato && stato !== 'all') {
      lavorazioniFiltrate = lavorazioni.filter(lav => {
        // Verifica se esiste statoLavorazione e se il suo codice contiene la stringa cercata
        // Usando includes() invece di una corrispondenza esatta
        return lav.statoLavorazione && 
               typeof lav.statoLavorazione.codice === 'string' && 
               lav.statoLavorazione.codice.includes(stato.replace('_', ''));
      });
      
      console.log(`Filtrate a ${lavorazioniFiltrate.length} lavorazioni con stato simile a "${stato}"`);
    }
    
    // Limita i risultati dopo il filtro
    lavorazioniFiltrate = lavorazioniFiltrate.slice(0, parseInt(limit));

    // Trasforma i dati per il frontend
    const lavorazioniFormatted = lavorazioniFiltrate.map(lav => ({
      _id: lav._id,
      numeroScheda: lav.numeroScheda || 'N/D',
      cliente: lav.cliente || { nome: 'N/D' },
      ricetta: lav.ricetta || { nome: 'N/D' },
      statoLavorazione: lav.statoLavorazione || { nome: 'Sconosciuto', codice: 'unknown' },
      dataLavorazione: lav.dataLavorazione,
      dataConsegnaPrevista: lav.dataConsegnaPrevista,
      operatore: lav.operatore || 'Non assegnato',
      isUrgente: lav.isUrgente || false,
      prioritaCliente: lav.prioritaCliente || 'normale'
    }));

    // Invia la risposta
    res.json({
      success: true,
      data: lavorazioniFormatted,
      meta: {
        total: lavorazioniFormatted.length,
        filter: stato || 'all'
      },
      message: 'Lavorazioni per dashboard recuperate con successo'
    });
  } catch (error) {
    console.error('Errore durante il recupero delle lavorazioni per dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero delle lavorazioni per dashboard',
      error: error.message
    });
  }
};
