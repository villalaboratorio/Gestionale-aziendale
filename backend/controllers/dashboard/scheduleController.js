const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

/**
 * Recupera gli eventi pianificati per il calendario
 */
exports.getScheduledEvents = async (req, res) => {
  try {
    const { startDate, endDate, types } = req.query;
    
    // Ottimizzazione: controllo più esplicito dei parametri
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date(start);
    end.setDate(end.getDate() + 30); // Default: 30 giorni se non specificato

    // Filtro per tipo di evento (array da stringa separata da virgole)
    const eventTypes = types ? types.split(',') : null;
    
    // Query ottimizzata per trovare lavorazioni pertinenti
    const query = {
      $or: [
        // Lavorazioni che iniziano nel periodo
        { dataLavorazione: { $gte: start, $lte: end } },
        // Lavorazioni con consegna nel periodo
        { dataConsegnaPrevista: { $gte: start, $lte: end } }
      ]
    };

    // Esegui la query con populate necessari
    const lavorazioni = await DettaglioLavorazione.find(query)
      .populate('cliente', 'nome')
      .populate('ricetta', 'nome')
      .populate('statoLavorazione', 'nome codice')
      .lean() // Ottimizzazione: usa lean() per ottenere POJO invece di documenti Mongoose
      .exec();
    
    console.log(`Trovate ${lavorazioni.length} lavorazioni nel periodo specificato`);
    
    // Array per contenere tutti gli eventi
    const events = [];
    
    // Ottimizzazione: elabora tutti gli eventi in un unico ciclo
    lavorazioni.forEach(lav => {
      // Ottimizzazione: estrai i valori comunemente utilizzati
      const ricettaNome = lav.ricetta?.nome || 'Lavorazione';
      const clienteNome = lav.cliente?.nome || 'N/D';
      const statoCodice = lav.statoLavorazione?.codice || 'scheduled';
      const statusMap = {
        'in_corso': 'in-progress',
        'in_attesa': 'scheduled',
        'completata': 'completed',
        'urgente': 'urgent'
      };
      const status = statusMap[statoCodice] || 'scheduled';
      
      // 1. Evento inizio lavorazione
      if (lav.dataLavorazione && (!eventTypes || eventTypes.includes('lavorazione'))) {
        events.push({
          _id: `start_${lav._id}`,
          date: lav.dataLavorazione ? lav.dataLavorazione.toISOString() : null, // Converti in ISO
          time: lav.dataLavorazione ? lav.dataLavorazione.toISOString() : null,          title: `Inizio: ${ricettaNome}`,
          description: lav.noteProduzione || '',
          client: clienteNome,
          status,
          type: 'lavorazione',
          detailsUrl: `/v2/lavorazione/${lav._id}`
        });
      }
      
      // 2. Evento consegna prevista
      if (lav.dataConsegnaPrevista && (!eventTypes || eventTypes.includes('consegna'))) {
        events.push({
          _id: `delivery_${lav._id}`,
          date: lav.dataConsegnaPrevista,
          time: lav.dataConsegnaPrevista,
          title: `Consegna: ${ricettaNome}`,
          description: `Consegna prevista per ${clienteNome}`,
          client: clienteNome,
          status: 'scheduled', // Le consegne sono sempre 'scheduled'
          type: 'consegna',
          detailsUrl: `/v2/lavorazione/${lav._id}`
        });
      }
      
      // 3. Aggiungi fasi speciali di lavorazione se opportuno
      // Esempio: cotture pianificate/in corso
      if (!eventTypes || eventTypes.includes('lavorazione')) {
        // Cotture
        lav.cotture?.forEach((cottura, idx) => {
          if (cottura.inizio && new Date(cottura.inizio) >= start && new Date(cottura.inizio) <= end) {
            events.push({
              _id: `cooking_${lav._id}_${idx}`,
              date: cottura.inizio,
              time: cottura.inizio,
              title: `Cottura: ${ricettaNome}`,
              description: `Operatore: ${cottura.addetto || 'N/D'}`,
              client: clienteNome,
              status: cottura.stato === 'completata' ? 'completed' : 'in-progress',
              type: 'lavorazione',
              detailsUrl: `/v2/lavorazione/${lav._id}`
            });
          }
        });
      }
    });
    
    // Ordina gli eventi per data
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Ottimizzazione: aggiunta di metadati utili
    const response = {
      success: true,
      data: events,
      meta: {
        totalCount: events.length,
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      },
      message: 'Eventi pianificati recuperati con successo'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Errore durante il recupero degli eventi pianificati:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero degli eventi pianificati',
      error: error.message
    });
  }
};
