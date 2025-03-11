/**
 * Controller per la gestione dell'abbattimento nelle lavorazioni
 * Gestisce tutte le operazioni CRUD e le operazioni specializzate dell'abbattimento
 */

const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');
const { createResponse } = require('../../utils/responseUtils');
const logger = require('../../utils/logger');

// Utility per calcolare la durata in minuti tra due date
const calcolaDurata = (inizio, fine) => {
    return Math.round((new Date(fine) - new Date(inizio)) / (1000 * 60));
};

const abbattimentoController = {
    /**
     * Recupera i dati di abbattimento di una lavorazione specifica
     */
    getAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            logger.info(`Recupero dati abbattimento per lavorazione ${id}`);
            
            const lavorazione = await DettaglioLavorazione.findById(id)
                .select('abbattimento');
                
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.debug(`Dati abbattimento recuperati: ${JSON.stringify(lavorazione.abbattimento)}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nel recupero dati abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nel recupero dati abbattimento", 
                error.message
            ));
        }
    },

    /**
     * Avvia il ciclo di abbattimento
     * Richiede temperatura iniziale e addetto
     */
    startAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const { temperaturaIniziale, temperaturaFinale, addetto } = req.body;
            
            logger.info(`Avvio abbattimento per lavorazione ${id}`);
            
            // Validazione dei dati
            if (!temperaturaIniziale || !addetto || !temperaturaFinale) {
                logger.warn('Dati mancanti per avvio abbattimento');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Dati mancanti: temperatura iniziale, temperatura target e addetto sono obbligatori"
                ));
            }

            const update = {
                'abbattimento.stato': 'in_corso',
                'abbattimento.inizio': new Date(),
                'abbattimento.temperaturaIniziale': temperaturaIniziale,
                'abbattimento.temperaturaFinale': temperaturaFinale,
                'abbattimento.addetto': addetto
            };

            logger.debug(`Aggiornamento abbattimento: ${JSON.stringify(update)}`);
            
            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            ).select('abbattimento');
            
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata per avvio abbattimento: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.info(`Abbattimento avviato con successo per lavorazione ${id}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nell'avvio abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'avvio abbattimento", 
                error.message
            ));
        }
    },

    /**
     * Completa il ciclo di abbattimento
     * Calcola il tempo totale e registra la temperatura finale
     */
    completeAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const { temperaturaFinale } = req.body;
            
            logger.info(`Completamento abbattimento per lavorazione ${id}`);
            
            if (!temperaturaFinale && temperaturaFinale !== 0) {
                logger.warn('Temperatura finale mancante per completamento abbattimento');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "La temperatura finale è obbligatoria"
                ));
            }

            // Recupera la lavorazione corrente
            const lavorazione = await DettaglioLavorazione.findById(id);
            
            if (!lavorazione || !lavorazione.abbattimento || !lavorazione.abbattimento.inizio) {
                logger.warn(`Abbattimento non avviato per lavorazione ${id}`);
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Abbattimento non avviato"
                ));
            }
            
            const now = new Date();
            const tempoTotale = calcolaDurata(lavorazione.abbattimento.inizio, now);

            const update = {
                'abbattimento.stato': 'completato',
                'abbattimento.fine': now,
                'abbattimento.temperaturaFinale': temperaturaFinale,
                'abbattimento.tempoTotale': tempoTotale
            };

            logger.debug(`Aggiornamento completamento abbattimento: ${JSON.stringify(update)}`);
            
            const updated = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            ).select('abbattimento');

            logger.info(`Abbattimento completato con successo per lavorazione ${id}`);
            res.json(createResponse(true, updated.abbattimento));
        } catch (error) {
            logger.error(`Errore nel completamento abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nel completamento abbattimento", 
                error.message
            ));
        }
    },

    /**
     * Registra la verifica di temperatura dell'abbattimento
     */
    registerTemperatureCheck: async (req, res) => {
        try {
            const { id } = req.params;
            const { responsabileVerifica } = req.body;
            
            logger.info(`Registrazione verifica temperatura per lavorazione ${id}`);
            
            if (!responsabileVerifica) {
                logger.warn('Responsabile verifica mancante');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Il responsabile della verifica è obbligatorio"
                ));
            }

            const update = {
                'abbattimento.verificaTemperatura': true,
                'abbattimento.responsabileVerifica': responsabileVerifica
            };

            logger.debug(`Aggiornamento verifica temperatura: ${JSON.stringify(update)}`);
            
            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            ).select('abbattimento');
            
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata per verifica temperatura: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.info(`Verifica temperatura registrata con successo per lavorazione ${id}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nella registrazione verifica temperatura: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nella registrazione verifica temperatura", 
                error.message
            ));
        }
    },

    /**
     * Aggiorna le note dell'abbattimento
     */
    updateNotes: async (req, res) => {
        try {
            const { id } = req.params;
            const { note } = req.body;
            
            logger.info(`Aggiornamento note abbattimento per lavorazione ${id}`);
            
            if (note === undefined) {
                logger.warn('Note mancanti per aggiornamento');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Le note sono obbligatorie"
                ));
            }

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: { 'abbattimento.note': note } },
                { new: true }
            ).select('abbattimento');
            
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata per aggiornamento note: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.info(`Note abbattimento aggiornate con successo per lavorazione ${id}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nell'aggiornamento note: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'aggiornamento note", 
                error.message
            ));
        }
    },
    
    /**
     * Aggiorna completamente i dati dell'abbattimento
     */
    updateAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const abbattimentoData = req.body;
            
            logger.info(`Aggiornamento completo abbattimento per lavorazione ${id}`);
            
            if (!abbattimentoData) {
                logger.warn('Dati mancanti per aggiornamento completo');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "I dati dell'abbattimento sono obbligatori"
                ));
            }

            // Validazione dei dati base
            if (abbattimentoData.stato === 'in_corso' && (!abbattimentoData.temperaturaIniziale || !abbattimentoData.addetto)) {
                logger.warn('Dati incompleti per abbattimento in corso');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Per un abbattimento in corso, temperatura iniziale e addetto sono obbligatori"
                ));
            }

            // Ricalcola il tempo totale se abbiamo inizio e fine
            if (abbattimentoData.inizio && abbattimentoData.fine) {
                abbattimentoData.tempoTotale = calcolaDurata(abbattimentoData.inizio, abbattimentoData.fine);
            }

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: { 'abbattimento': abbattimentoData } },
                { new: true }
            ).select('abbattimento');
            
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata per aggiornamento completo: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.info(`Abbattimento aggiornato completamente con successo per lavorazione ${id}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nell'aggiornamento completo abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'aggiornamento completo abbattimento", 
                error.message
            ));
        }
    },
    
    /**
     * Elimina o resetta i dati dell'abbattimento
     */
    deleteAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            
            logger.info(`Eliminazione abbattimento per lavorazione ${id}`);
            
            // Resettiamo i dati dell'abbattimento
            const defaultAbbattimento = {
                stato: 'non_iniziato',
                inizio: null,
                fine: null,
                temperaturaIniziale: null,
                temperaturaFinale: null,
                addetto: '',
                tempoTotale: null,
                verificaTemperatura: false,
                responsabileVerifica: '',
                note: ''
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: { 'abbattimento': defaultAbbattimento } },
                { new: true }
            ).select('abbattimento');
            
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata per eliminazione abbattimento: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.info(`Abbattimento eliminato con successo per lavorazione ${id}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nell'eliminazione abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'eliminazione abbattimento", 
                error.message
            ));
        }
    },

    /**
     * Valuta la qualità dell'abbattimento in base a tempo e temperatura
     */
    validateAbbattimento: async (req, res) => {
        try {
            const { id } = req.params;
            const { valutazione, note } = req.body;
            
            logger.info(`Validazione abbattimento per lavorazione ${id}`);
            
            if (!valutazione) {
                logger.warn('Valutazione mancante per validazione abbattimento');
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "La valutazione è obbligatoria"
                ));
            }

            // Verifica che la valutazione sia valida
            const valutazioniValide = ['ottimale', 'veloce', 'lento'];
            if (!valutazioniValide.includes(valutazione)) {
                logger.warn(`Valutazione non valida: ${valutazione}`);
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Valutazione non valida. Valori accettati: ottimale, veloce, lento"
                ));
            }

            const update = {
                'abbattimento.validazione': {
                    isValidato: true,
                    valutazione,
                    note: notes || ''
                }
            };

            logger.debug(`Aggiornamento validazione abbattimento: ${JSON.stringify(update)}`);
            
            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $set: update },
                { new: true }
            ).select('abbattimento');
            
            if (!lavorazione) {
                logger.warn(`Lavorazione non trovata per validazione abbattimento: ${id}`);
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            logger.info(`Abbattimento validato con successo per lavorazione ${id}`);
            res.json(createResponse(true, lavorazione.abbattimento));
        } catch (error) {
            logger.error(`Errore nella validazione abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nella validazione abbattimento", 
                error.message
            ));
        }
    },

    /**
     * Ottiene statistiche sugli abbattimenti (tempi medi, temperature medie)
     * Può essere usato per report e analisi
     */
    getAbbattimentoStats: async (req, res) => {
        try {
            const { periodo } = req.query; // Esempio: 'day', 'week', 'month'
            logger.info(`Recupero statistiche abbattimento, periodo: ${periodo}`);

            // Crea un filtro di data in base al periodo
            let dateFilter = {};
            const now = new Date();
            
            if (periodo === 'day') {
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                dateFilter = { 'abbattimento.inizio': { $gte: startOfDay } };
            } else if (periodo === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Domenica
                startOfWeek.setHours(0, 0, 0, 0);
                dateFilter = { 'abbattimento.inizio': { $gte: startOfWeek } };
            } else if (periodo === 'month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = { 'abbattimento.inizio': { $gte: startOfMonth } };
            }

            // Pipeline di aggregazione per le statistiche
            const pipeline = [
                {
                    $match: {
                        'abbattimento.stato': 'completato',
                        ...dateFilter
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        mediaTempoTotale: { $avg: '$abbattimento.tempoTotale' },
                        mediaTemperaturaIniziale: { $avg: '$abbattimento.temperaturaIniziale' },
                        mediaTemperaturaFinale: { $avg: '$abbattimento.temperaturaFinale' },
                        tempoMinimo: { $min: '$abbattimento.tempoTotale' },
                        tempoMassimo: { $max: '$abbattimento.tempoTotale' },
                        abbattimentiVerificati: {
                            $sum: { $cond: ['$abbattimento.verificaTemperatura', 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        mediaTempoTotale: { $round: ['$mediaTempoTotale', 2] },
                        mediaTemperaturaIniziale: { $round: ['$mediaTemperaturaIniziale', 2] },
                        mediaTemperaturaFinale: { $round: ['$mediaTemperaturaFinale', 2] },
                        tempoMinimo: 1,
                        tempoMassimo: 1,
                        abbattimentiVerificati: 1,
                        percentualeVerificati: {
                            $round: [{ $multiply: [{ $divide: ['$abbattimentiVerificati', '$count'] }, 100] }, 2]
                        }
                    }
                }
            ];

            const stats = await DettaglioLavorazione.aggregate(pipeline);
            
            const result = stats.length > 0 ? stats[0] : {
                count: 0,
                mediaTempoTotale: 0,
                mediaTemperaturaIniziale: 0,
                mediaTemperaturaFinale: 0,
                tempoMinimo: 0,
                tempoMassimo: 0,
                abbattimentiVerificati: 0,
                percentualeVerificati: 0
            };

            logger.info(`Statistiche abbattimento recuperate con successo`);
            res.json(createResponse(true, result));
        } catch (error) {
            logger.error(`Errore nel recupero statistiche abbattimento: ${error.message}`);
            res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nel recupero statistiche abbattimento", 
                error.message
            ));
        }
    }
};

module.exports = abbattimentoController;
