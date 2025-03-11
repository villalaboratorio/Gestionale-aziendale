const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

// Utility function per le statistiche
const getDashboardStats = async () => {
    const stats = await DettaglioLavorazione.aggregate([
        // Prima facciamo il lookup per recuperare gli stati
        {
            $lookup: {
                from: "processingstates", // nome della collezione degli stati
                localField: "statoLavorazione",
                foreignField: "_id",
                as: "statoInfo"
            }
        },
        {
            $addFields: {
                // Estraiamo il nome dello stato dal primo elemento dell'array
                statoNome: { $arrayElemAt: ["$statoInfo.name", 0] }
            }
        },
        {
            $group: {
                _id: null,
                totali: { $sum: 1 },
                inLavorazione: {
                    $sum: { 
                        $cond: [{ $eq: ["$statoNome", "IN LAVORAZIONE"] }, 1, 0] 
                    }
                },
                inAttesa: {
                    $sum: { 
                        $cond: [{ $eq: ["$statoNome", "IN ATTESA"] }, 1, 0] 
                    }
                },
                completate: {
                    $sum: { 
                        $cond: [{ $eq: ["$statoNome", "COMPLETATA"] }, 1, 0] 
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
    // 1. OPERAZIONI PRINCIPALI DI RECUPERO DATI
    async getDashboardData(req, res) {
        try {
            const { 
                sortBy = 'dataLavorazione',
                sortOrder = 'desc',
                page = 1,
                limit = 10,
                status,
                dateFrom,
                dateTo,
                search
            } = req.query;

            const query = {};

            if (status) {
                query.statoLavorazione = status;
            }

            if (dateFrom || dateTo) {
                query.dataLavorazione = {};
                if (dateFrom) query.dataLavorazione.$gte = new Date(dateFrom);
                if (dateTo) query.dataLavorazione.$lte = new Date(dateTo);
            }

            if (search) {
                query.$or = [
                    { numeroScheda: { $regex: search, $options: 'i' } },
                    { 'cliente.nome': { $regex: search, $options: 'i' } },
                    { 'ricetta.nome': { $regex: search, $options: 'i' } }
                ];
            }

            const validatedLimit = Math.min(parseInt(limit) || 10, 50);
            const validatedPage = Math.max(parseInt(page) || 1, 1);
            const validatedSort = {};
            validatedSort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const [lavorazioni, total, stats] = await Promise.all([
                DettaglioLavorazione.find(query)
                    .populate(['cliente', 'ricetta', 'tipoLavorazione', 'statoLavorazione'])
                    .sort(validatedSort)
                    .skip((validatedPage - 1) * validatedLimit)
                    .limit(validatedLimit)
                    .lean(),
                DettaglioLavorazione.countDocuments(query),
                getDashboardStats()
            ]);

            res.json({
                success: true,
                data: {
                    items: lavorazioni,
                    stats,
                    pagination: {
                        total,
                        pages: Math.ceil(total / validatedLimit),
                        currentPage: validatedPage,
                        pageSize: validatedLimit
                    }
                }
            });
        } catch (error) {
            console.error('Errore dettagliato:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Errore nel recupero dei dati dashboard',
                    details: error.message
                }
            });
        }
    },

    async getFilteredDashboard(req, res) {
        try {
            const { filters } = req.query;
            const query = {};
            
            if (filters) {
                const parsedFilters = JSON.parse(filters);
                if (parsedFilters.status) query.statoLavorazione = parsedFilters.status;
                if (parsedFilters.cliente) query.cliente = parsedFilters.cliente;
                if (parsedFilters.ricetta) query.ricetta = parsedFilters.ricetta;
                if (parsedFilters.isUrgente) query.isUrgente = parsedFilters.isUrgente;
                if (parsedFilters.priorita) query.prioritaCliente = parsedFilters.priorita;
            }

            const lavorazioni = await DettaglioLavorazione.find(query)
                .populate(['cliente', 'ricetta', 'tipoLavorazione', 'statoLavorazione'])
                .lean();

            res.json({
                success: true,
                data: lavorazioni
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: error.message }
            });
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
                return res.status(404).json({
                    success: false,
                    error: { message: 'Lavorazione non trovata' }
                });
            }

            res.json({
                success: true,
                data: lavorazione
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message }
            });
        }
    },

    // 2. OPERAZIONI STATISTICHE
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

            res.json({
                success: true,
                data: trends
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: {
                    message: error.message || "Errore nel recupero dei trend"
                }
            });
        }
    },

    // 3. OPERAZIONI CRUD
    async createDashboardItem(req, res) {
        try {
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

            res.status(201).json({
                success: true,
                data: lavorazionePopolata
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: error.message }
            });
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
                return res.status(404).json({
                    success: false,
                    error: { message: 'Lavorazione non trovata' }
                });
            }

            res.json({
                success: true,
                data: lavorazione
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: error.message }
            });
        }
    },

    async deleteDashboardItem(req, res) {
        try {
            const lavorazione = await DettaglioLavorazione.findByIdAndDelete(req.params.id);
            
            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Lavorazione non trovata' }
                });
            }

            res.json({
                success: true,
                message: 'Lavorazione eliminata con successo'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message }
            });
        }
    },

    // 4. OPERAZIONI SPECIALIZZATE
    async getTimeline(req, res) {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id);
            
            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Lavorazione non trovata' }
                });
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

            res.json({
                success: true,
                data: timeline
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message }
            });
        }
    },

    async getAvanzamento(req, res) {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id);

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    error: { message: 'Lavorazione non trovata' }
                });
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

            // Calcolo tempi
            if (lavorazione.tempiStimati) {
                avanzamento.tempoStimato = lavorazione.tempiStimati.totale || 0;
            }

            // Calcolo tempo effettivo dalle fasi completate
            const tempiEffettivi = {
                cottura: lavorazione.cottura?.fine && lavorazione.cottura?.inizio ? 
                    new Date(lavorazione.cottura.fine) - new Date(lavorazione.cottura.inizio) : 0,
                abbattimento: lavorazione.abbattimento?.fine && lavorazione.abbattimento?.inizio ?
                    new Date(lavorazione.abbattimento.fine) - new Date(lavorazione.abbattimento.inizio) : 0,
                assemblaggio: lavorazione.assemblaggio?.fineAssemblaggio && lavorazione.assemblaggio?.inizioAssemblaggio ?
                    new Date(lavorazione.assemblaggio.fineAssemblaggio) - new Date(lavorazione.assemblaggio.inizioAssemblaggio) : 0,
                conservazione: lavorazione.conservazione?.fine && lavorazione.conservazione?.inizio ?
                    new Date(lavorazione.conservazione.fine) - new Date(lavorazione.conservazione.inizio) : 0
            };

            avanzamento.tempoEffettivo = Object.values(tempiEffettivi)
                .reduce((acc, curr) => acc + curr, 0);

            res.json({
                success: true,
                data: avanzamento
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: { message: error.message }
            });
        }
    }
};

module.exports = dashboardController;
