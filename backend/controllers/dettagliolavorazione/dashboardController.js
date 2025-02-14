const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const getDashboardStats = async () => {
    const stats = await DettaglioLavorazione.aggregate([
        {
            $group: {
                _id: null,
                totali: { $sum: 1 },
                inLavorazione: {
                    $sum: { 
                        $cond: [{ $eq: ["$statoLavorazione", "IN_LAVORAZIONE"] }, 1, 0] 
                    }
                },
                inAttesa: {
                    $sum: { 
                        $cond: [{ $eq: ["$statoLavorazione", "IN_ATTESA"] }, 1, 0] 
                    }
                },
                completate: {
                    $sum: { 
                        $cond: [{ $eq: ["$statoLavorazione", "COMPLETATA"] }, 1, 0] 
                    }
                },
                urgenti: { 
                    $sum: { $cond: ["$isUrgente", 1, 0] } 
                },
                prioritaAlta: {
                    $sum: { 
                        $cond: [{ $eq: ["$prioritaCliente", "alta"] }, 1, 0] 
                    }
                }
            }
        }
    ]);

    return stats[0] || {
        totali: 0,
        inLavorazione: 0,
        inAttesa: 0,
        completate: 0,
        urgenti: 0,
        prioritaAlta: 0
    };
};

const dashboardController = {
    
    async getDashboardData(req, res) {
        console.log('Ricevuta richiesta dashboard:', req.query);
        try {
            const { 
                sortBy = 'dataLavorazione',
                sortOrder = 'desc',
                page = 1,
                limit = 10 
            } = req.query;

            const validatedLimit = Math.min(parseInt(limit) || 10, 50);
            const validatedPage = Math.max(parseInt(page) || 1, 1);
            const validatedSort = {};
            validatedSort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const [lavorazioni, total, stats] = await Promise.all([
                DettaglioLavorazione.find()
                    .populate(['cliente', 'ricetta', 'tipoLavorazione', 'statoLavorazione'])
                    .sort(validatedSort)
                    .skip((validatedPage - 1) * validatedLimit)
                    .limit(validatedLimit)
                    .lean(),
                DettaglioLavorazione.countDocuments(),
                getDashboardStats()
            ]);

            res.json({
                success: true,
                lavorazioni,
                stats,
                pagination: {
                    total,
                    pages: Math.ceil(total / validatedLimit),
                    currentPage: validatedPage,
                    pageSize: validatedLimit
                }
            });
        } catch (error) {
            console.error('Errore dettagliato:', error);
            res.status(500).json({
                success: false,
                message: 'Errore nel recupero dei dati dashboard',
                error: error.message
            });
        }
    },

    async getDashboardLavorazioni(req, res) {
        try {
            const lavorazioni = await DettaglioLavorazione.find()
                .populate([
                    { path: 'cliente', select: 'nome riferimento' },
                    { path: 'ricetta', select: 'nome codice' },
                    { path: 'tipoLavorazione', select: 'name description' },
                    { path: 'statoLavorazione', select: 'name description' }
                ])
                .sort('-dataLavorazione')
                .lean();
            res.json(lavorazioni);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getDashboardById(req, res) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(req.params.id)
                .populate([
                    { path: 'cliente', select: 'nome riferimento' },
                    { path: 'ricetta', select: 'nome codice' },
                    { path: 'tipoLavorazione', select: 'name description' },
                    { path: 'statoLavorazione', select: 'name description' }
                ]);
            
            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }
            res.json(lavorazione);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
      async createDashboardItem(req, res) {
          try {
              // Genera numeroScheda
              const currentYear = new Date().getFullYear();
              const lastLavorazione = await DettaglioLavorazione
                  .findOne({ numeroScheda: new RegExp(`LAV-${currentYear}-`) })
                  .sort({ numeroScheda: -1 });

              let nextNumber = 1;
              if (lastLavorazione) {
                  const lastNumber = parseInt(lastLavorazione.numeroScheda.split('-')[2]);
                  nextNumber = lastNumber + 1;
              }
            
              const numeroScheda = `LAV-${currentYear}-${String(nextNumber).padStart(3, '0')}`;

              // Crea nuova lavorazione con numeroScheda generato
              const nuovaLavorazione = new DettaglioLavorazione({
                  ...req.body,
                  numeroScheda
              });

              const lavorazioneSalvata = await nuovaLavorazione.save();
            
              const lavorazionePopolata = await DettaglioLavorazione.findById(lavorazioneSalvata._id)
                  .populate([
                      { path: 'cliente', select: 'nome riferimento' },
                      { path: 'ricetta', select: 'nome codice' },
                      { path: 'tipoLavorazione', select: 'name description' },
                      { path: 'statoLavorazione', select: 'name description' }
                  ]);

              res.status(201).json(lavorazionePopolata);
          } catch (error) {
              res.status(400).json({ message: error.message });
          }
      },
    async updateDashboard(req, res) {
        try {
            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate([
                { path: 'cliente', select: 'nome riferimento' },
                { path: 'ricetta', select: 'nome codice' },
                { path: 'tipoLavorazione', select: 'name description' },
                { path: 'statoLavorazione', select: 'name description' }
            ]);

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }
            res.json(lavorazione);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteDashboardItem(req, res) {
        try {
            const lavorazione = await DettaglioLavorazione.findByIdAndDelete(req.params.id);
            
            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }
            res.json({ message: 'Lavorazione eliminata con successo' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDashboardStats,

    async getTrends(req, res) {
        try {
            const { periodo = 'mensile', anno } = req.query;
            const matchStage = anno ? { 
                $match: { 
                    dataLavorazione: {
                        $gte: new Date(`${anno}-01-01`),
                        $lte: new Date(`${anno}-12-31`)
                    }
                }
            } : { $match: {} };

            const groupStage = periodo === 'mensile' ? {
                $group: {
                    _id: {
                        year: { $year: "$dataLavorazione" },
                        month: { $month: "$dataLavorazione" }
                    },
                    count: { $sum: 1 }
                }
            } : {
                $group: {
                    _id: {
                        year: { $year: "$dataLavorazione" }
                    },
                    count: { $sum: 1 }
                }
            };

            const trends = await DettaglioLavorazione.aggregate([
                matchStage,
                groupStage,
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            res.json(trends);
        } catch (error) {
            res.status(400).json({
                message: error.message || "Errore nel recupero dei trend"
            });
        }
    },

    async getTimeline(req, res) {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id);
            
            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            const timeline = {
                creazione: lavorazione.createdAt,
                fasi: [
                    {
                        nome: 'Cottura',
                        inizio: lavorazione.cottura?.inizio,
                        fine: lavorazione.cottura?.fine,
                        stato: lavorazione.cottura?.fine ? 'completata' : 'in corso'
                    },
                    {
                        nome: 'Abbattimento',
                        inizio: lavorazione.abbattimento?.inizio,
                        fine: lavorazione.abbattimento?.fine,
                        stato: lavorazione.abbattimento?.fine ? 'completata' : 'in corso'
                    },
                    {
                        nome: 'Assemblaggio',
                        inizio: lavorazione.assemblaggio?.inizioAssemblaggio,
                        fine: lavorazione.assemblaggio?.fineAssemblaggio,
                        stato: lavorazione.assemblaggio?.fineAssemblaggio ? 'completata' : 'in corso'
                    },
                    {
                        nome: 'Conservazione',
                        inizio: lavorazione.conservazione?.inizio,
                        fine: lavorazione.conservazione?.fine,
                        stato: lavorazione.conservazione?.fine ? 'completata' : 'in corso'
                    }
                ]
            };

            res.json(timeline);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getAvanzamento(req, res) {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id);

            if (!lavorazione) {
                return res.status(404).json({ message: 'Lavorazione non trovata' });
            }

            const avanzamento = {
                percentualeCompletamento: 0,
                faseCorrente: '',
                tempoStimato: 0,
                tempoEffettivo: 0,
                statoFasi: {
                    cottura: lavorazione.cottura?.fine ? 'completata' : 
                            lavorazione.cottura?.inizio ? 'in corso' : 'da iniziare',
                    abbattimento: lavorazione.abbattimento?.fine ? 'completata' : 
                                lavorazione.abbattimento?.inizio ? 'in corso' : 'da iniziare',
                    assemblaggio: lavorazione.assemblaggio?.fineAssemblaggio ? 'completata' : 
                                lavorazione.assemblaggio?.inizioAssemblaggio ? 'in corso' : 'da iniziare',
                    conservazione: lavorazione.conservazione?.fine ? 'completata' : 
                                 lavorazione.conservazione?.inizio ? 'in corso' : 'da iniziare'
                }
            };

            const fasiCompletate = Object.values(avanzamento.statoFasi)
                .filter(stato => stato === 'completata').length;
            avanzamento.percentualeCompletamento = (fasiCompletate / 4) * 100;

            const fasiInCorso = Object.entries(avanzamento.statoFasi)
                .find(([_, stato]) => stato === 'in corso');
            avanzamento.faseCorrente = fasiInCorso ? fasiInCorso[0] : 'nessuna';

            res.json(avanzamento);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = dashboardController;
