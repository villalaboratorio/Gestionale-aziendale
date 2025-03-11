const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

/**
 * Recupera KPI per la dashboard
 */
exports.getKPIs = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Determina l'intervallo di date
    const now = new Date();
    let startDate;
    
    if (period === 'day') {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    // Calcola vari KPI utilizzando aggregation pipeline
    const kpiAggregation = await DettaglioLavorazione.aggregate([
      {
        $match: {
          updatedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "processingstates",
          localField: "statoLavorazione",
          foreignField: "_id",
          as: "statoInfo"
        }
      },
      {
        $unwind: {
          path: "$statoInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$statoInfo.codice",
          count: { $sum: 1 },
          porzioniTotali: { $sum: "$porzioniPreviste" },
          pesoTotale: { $sum: "$pesoTotale" }
        }
      }
    ]);
    
    // Prepara i risultati
    const kpiResults = {
      lavorazioniCompletate: 0,
      porzioniProdotte: 0,
      kgProcessati: 0,
      efficienza: 0
    };
    
    // Elabora i risultati dell'aggregazione
    kpiAggregation.forEach(item => {
      if (item._id === 'completata') {
        kpiResults.lavorazioniCompletate = item.count;
        kpiResults.porzioniProdotte = item.porzioniTotali || 0;
        kpiResults.kgProcessati = item.pesoTotale ? parseFloat((item.pesoTotale / 1000).toFixed(2)) : 0;
      }
    });
    
    // Calcola efficienza (percentuale di lavorazioni completate in tempo)
    const efficienzaAgg = await DettaglioLavorazione.aggregate([
      {
        $match: {
          statoLavorazione: { $exists: true },
          dataConsegnaPrevista: { $exists: true },
          updatedAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "processingstates",
          localField: "statoLavorazione",
          foreignField: "_id",
          as: "statoInfo"
        }
      },
      {
        $unwind: "$statoInfo"
      },
      {
        $match: {
          "statoInfo.codice": "completata"
        }
      },
      {
        $project: {
          inTempo: {
            $cond: {
              if: { $lte: ["$updatedAt", "$dataConsegnaPrevista"] },
              then: 1,
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totale: { $sum: 1 },
          inTempo: { $sum: "$inTempo" }
        }
      },
      {
        $project: {
          _id: 0,
          percentuale: {
            $cond: {
              if: { $eq: ["$totale", 0] },
              then: 0,
              else: { $multiply: [{ $divide: ["$inTempo", "$totale"] }, 100] }
            }
          }
        }
      }
    ]);
    
    // Aggiunge percentuale efficienza se disponibile
    if (efficienzaAgg.length > 0) {
      kpiResults.efficienza = Math.round(efficienzaAgg[0].percentuale);
    }
    
    res.json({
      success: true,
      data: kpiResults,
      meta: { period },
      message: 'KPI recuperati con successo'
    });
  } catch (error) {
    console.error('Errore durante il recupero dei KPI:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei KPI',
      error: error.message
    });
  }
};
