const MateriaPrima = require('../../models/materiePrimeModel');

/**
 * Recupera statistiche sulle materie prime
 */
exports.getMateriePrimeStats = async (req, res) => {
  try {
    // Log per debug
    console.log("Iniziata elaborazione getMateriePrimeStats");
    
    const oggi = new Date();
    console.log("Data di riferimento per calcoli:", oggi);
    
    // Approccio alternativo: prima conta il totale e poi fa aggregazione
    // Questo è più robusto in caso di errori nell'aggregazione
    const totaleInGiacenza = await MateriaPrima.countDocuments({ 
      quantitaResidua: { $gt: 0 } 
    });
    console.log("Totale materie prime in giacenza:", totaleInGiacenza);
    
    // Ottimizzazione: usa aggregation pipeline per calcoli complessi in una singola query
    const materiePrimeStats = await MateriaPrima.aggregate([
      {
        $match: {
          quantitaResidua: { $gt: 0 } // Solo materiali ancora in giacenza
        }
      },
      {
        $project: {
          giorniGiacenza: {
            $floor: {
              $divide: [
                { $subtract: [oggi, "$date"] },
                1000 * 60 * 60 * 24 // Converti ms in giorni
              ]
            }
          },
          quantitaResidua: 1,
          quantitaIniziale: 1
        }
      },
      {
        $group: {
          _id: null,
          critiche: {
            $sum: {
              $cond: [{ $gte: ["$giorniGiacenza", 5] }, 1, 0]
            }
          },
          inScadenza: {
            $sum: {
              $cond: [
                { $and: [
                  { $gte: ["$giorniGiacenza", 3] },
                  { $lt: ["$giorniGiacenza", 5] }
                ]},
                1,
                0
              ]
            }
          },
          percUtilizzo: {
            $avg: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$quantitaIniziale", "$quantitaResidua"] },
                    { $cond: [{ $eq: ["$quantitaIniziale", 0] }, 1, "$quantitaIniziale"] }
                  ]
                },
                100
              ]
            }
          }
        }
      }
    ]);
    
    console.log("Risultati aggregazione:", JSON.stringify(materiePrimeStats, null, 2));

    // Elabora risultati o usa valori di default
    const stats = materiePrimeStats.length > 0 ? materiePrimeStats[0] : {
      critiche: 0,
      inScadenza: 0,
      percUtilizzo: 0
    };

    // Aggiorna con il valore totale già calcolato
    stats.totaleInGiacenza = totaleInGiacenza;
    
    // Assicurati che percUtilizzo non sia NaN
    if (isNaN(stats.percUtilizzo)) {
      stats.percUtilizzo = 0;
    }
    
    const response = {
      success: true,
      data: {
        totaleInGiacenza: stats.totaleInGiacenza || 0,
        critiche: stats.critiche || 0,
        inScadenza: stats.inScadenza || 0,
        percUtilizzo: Math.round(stats.percUtilizzo || 0)
      },
      message: 'Statistiche materie prime recuperate con successo'
    };
    
    console.log("Risposta finale:", JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error('Errore durante il recupero delle statistiche materie prime:', error);
    
    // Restituisci un formato coerente anche in caso di errore
    res.status(500).json({
      success: false,
      data: {
        totaleInGiacenza: 0,
        critiche: 0,
        inScadenza: 0,
        percUtilizzo: 0
      },
      message: 'Errore durante il recupero delle statistiche materie prime',
      error: error.message
    });
  }
};
