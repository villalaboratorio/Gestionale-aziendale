const DettaglioLavorazione = require('../models/dettaglioLavorazioneModel');
const Cliente = require('../models/clienteModel');
const Ricetta = require('../models/ricettaModel');
const TipoLavorazione = require('../models/processingTypesModel');
const tipoCottura = require('../models/tipoCotturaModel');
const assemblaggioController = require('../controllers/dettaglioLavorazione/assemblaggioController');
const passaggiController = require('../controllers/dettaglioLavorazione/passaggiController');

const {
    dashboard,
    cottura,
   passaggi,
   abbattimento,
    assemblaggio,
    conservazione,
    informazioniGenerali
} = require('./dettaglioLavorazione');

const tipoCotturaModel = require('../models/tipoCotturaModel');

// Utility function for standardized responses
const createResponse = (success, data = null, message = null) => ({
    success,
    ...(data && { data }),
    ...(message && { message }),
    timestamp: new Date().toISOString()
});

const dettaglioLavorazioneController = {
    async getInformazioniGenerali(req, res) {
        console.group('🔍 Elaborazione getInformazioniGenerali');
        const { id } = req.params;

        try {
            const lavorazione = await informazioniGenerali.getLavorazioneDetails(id);
            const dashboardInfo = await dashboard.getDashboardData(id);

            const responseData = {
                ...lavorazione,
                dashboardMetrics: dashboardInfo
            };

            console.log('✅ Dati elaborati con successo');
            res.json(createResponse(true, responseData));
        } catch (error) {
            console.error('❌ Errore:', error);
            res.status(500).json(createResponse(false, null, error.message));
        } finally {
            console.groupEnd();
        }
    },

    async getCollections(req, res) {
        try {
            const collections = await informazioniGenerali.getAllCollections();
            res.json(createResponse(true, collections));
        } catch (error) {
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async createLavorazione(req, res) {
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

            await dashboard.updateDashboardStats(lavorazioneSalvata._id);

            res.status(201).json(createResponse(true, lavorazionePopolata));
        } catch (error) {
            res.status(400).json(createResponse(false, null, error.message));
        }
    },

    async updateLavorazione(req, res) {
        const { id } = req.params;
        try {
            const updatedLavorazione = await informazioniGenerali.updateLavorazione(id, req.body);
            if (!updatedLavorazione) {
                return res.status(404).json(createResponse(false, null, 'Lavorazione non trovata'));
            }

            // Aggiorna i dati correlati
            await Promise.all([
                dashboard.updateDashboardStats(id),
                cottura.updateCotturaStatus(id),
                abbattimento.updateAbbattimentoStatus(id)
            ]);

            res.json(createResponse(true, updatedLavorazione));
        } catch (error) {
            res.status(400).json(createResponse(false, null, error.message));
        }
    },

    async deleteLavorazione(req, res) {
        const { id } = req.params;
        try {
            const result = await informazioniGenerali.deleteLavorazione(id);
            if (!result) {
                return res.status(404).json(createResponse(false, null, 'Lavorazione non trovata'));
            }

            // Cleanup correlato
            await Promise.all([
                dashboard.removeDashboardEntry(id),
                cottura.deleteCotturaData(id),
                abbattimento.deleteAbbattimentoData(id)
            ]);

            res.json(createResponse(true, null, 'Lavorazione eliminata con successo'));
        } catch (error) {
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async updateStatoLavorazione(req, res) {
        const { id } = req.params;
        const { stato } = req.body;

        try {
            const updatedLavorazione = await informazioniGenerali.updateStatoLavorazione(id, stato);
            if (!updatedLavorazione) {
                return res.status(404).json(createResponse(false, null, 'Lavorazione non trovata'));
            }

            // Aggiorna stati correlati
            await Promise.all([
                dashboard.updateProcessingState(id, stato),
                cottura.handleStateChange(id, stato),
                abbattimento.handleStateChange(id, stato)
            ]);

            res.json(createResponse(true, updatedLavorazione));
        } catch (error) {
            res.status(400).json(createResponse(false, null, error.message));
        }
    },
   //ABBATTIMENTO
async getAbbattimento(req, res) {
    try {
        const { id } = req.params;
        const result = await abbattimentoController.getAbbattimento(id);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error('Errore nel recupero dei dati di abbattimento:', error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async startAbbattimento(req, res) {
    try {
        const { id } = req.params;
        const result = await abbattimentoController.startAbbattimento(id, req.body);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error('Errore nell\'avvio dell\'abbattimento:', error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async completeAbbattimento(req, res) {
    try {
        const { id } = req.params;
        const result = await abbattimentoController.completeAbbattimento(id, req.body);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error('Errore nel completamento dell\'abbattimento:', error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async updateAbbattimento(req, res) {
    try {
        const { id } = req.params;
        const result = await abbattimentoController.updateAbbattimento(id, req.body);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error('Errore nell\'aggiornamento dell\'abbattimento:', error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},
async registerTemperatureCheck(req, res) {
    try {
        const { id } = req.params;
        const result = await abbattimentoController.registerTemperatureCheck(id, req.body);
        res.json({success: true, data: result});
    } catch (error) {
        console.error('Errore nella registrazione temperatura:', error);
        res.status(500).json({success: false, message: error.message});
    }
},

async updateNotes(req, res) {
    try {
        const { id } = req.params;
        const result = await abbattimentoController.updateNotes(id, req.body);
        res.json({success: true, data: result});
    } catch (error) {
        console.error('Errore nell\'aggiornamento note:', error);
        res.status(500).json({success: false, message: error.message});
    }
},
// ASSEMBLAGGIO
// Aggiungi queste funzioni all'oggetto dettaglioLavorazioneController
async getAssemblaggio(req, res) {
    try {
        const { id } = req.params;
        const result = await assemblaggioController.getAssemblaggio(id);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error('Errore nel recupero dei dati di assemblaggio:', error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async updateFaseAssemblaggio(req, res) {
    try {
        const { id, fase } = req.params;
        const result = await assemblaggioController.updateFaseAssemblaggio(id, fase, req.body);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error(`Errore nell'aggiornamento della fase ${req.params.fase}:`, error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async startFaseAssemblaggio(req, res) {
    try {
        const { id, fase } = req.params;
        const { addetto } = req.body;
        const result = await assemblaggioController.startFaseAssemblaggio(id, fase, addetto);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error(`Errore nell'avvio della fase ${req.params.fase}:`, error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async completeFaseAssemblaggio(req, res) {
    try {
        const { id, fase } = req.params;
        const result = await assemblaggioController.completeFaseAssemblaggio(id, fase, req.body);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error(`Errore nel completamento della fase ${req.params.fase}:`, error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},

async getAssemblaggioStatus(req, res) {
    try {
        const { id } = req.params;
        const result = await assemblaggioController.getAssemblaggioStatus(id);
        res.json(createResponse(true, result));
    } catch (error) {
        console.error('Errore nel recupero dello stato dell\'assemblaggio:', error);
        res.status(500).json(createResponse(false, null, error.message));
    }
},
    //  FUNZIONI PER I PASSAGGI DI LAVORAZIONE
    async getPassaggiLavorazione(req, res) {
        try {
            const { id } = req.params;
            const result = await passaggiController.getPassaggiLavorazione(id);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nel recupero dei passaggi:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async updatePassaggiLavorazione(req, res) {
        try {
            const { id } = req.params;
            const { passaggi } = req.body;
            const result = await passaggiController.updatePassaggiLavorazione(id, passaggi);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nell\'aggiornamento dei passaggi:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async createPassaggio(req, res) {
        try {
            const { id } = req.params;
            const result = await passaggiController.createPassaggio(id, req.body);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nella creazione del passaggio:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async deletePassaggio(req, res) {
        try {
            const { id, passaggioId } = req.params;
            const result = await passaggiController.deletePassaggio(id, passaggioId);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nella eliminazione del passaggio:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async startPassaggio(req, res) {
        try {
            const { id, passaggioId } = req.params;
            const { operatore } = req.body;
            const result = await passaggiController.startPassaggio(id, passaggioId, operatore);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nell\'avvio del passaggio:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async completePassaggio(req, res) {
        try {
            const { id, passaggioId } = req.params;
            const result = await passaggiController.completePassaggio(id, passaggioId);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nel completamento del passaggio:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async addNoteToPassaggio(req, res) {
        try {
            const { id, passaggioId } = req.params;
            const { note } = req.body;
            const result = await passaggiController.addNoteToPassaggio(id, passaggioId, note);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nell\'aggiunta di note al passaggio:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    },

    async getPassaggiStatus(req, res) {
        try {
            const { id } = req.params;
            const result = await passaggiController.getPassaggiStatus(id);
            res.json(createResponse(true, result));
        } catch (error) {
            console.error('Errore nel recupero dello stato dei passaggi:', error);
            res.status(500).json(createResponse(false, null, error.message));
        }
    }
};

module.exports = dettaglioLavorazioneController;
