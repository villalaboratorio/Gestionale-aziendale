const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');
const { createResponse } = require('../../utils/responseUtils');

/**
 * Valida che la temperatura sia in un range accettabile (0-300°C)
 * @param {number} temp - Temperatura da validare
 * @returns {boolean} - True se la temperatura è valida
 */
const validateTemperatura = (temp) => {
    return temp >= 0 && temp <= 300;
};

const cotturaController = {
    /**
     * Recupera i parametri di cottura per una lavorazione
     */
    getParametriCottura: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .populate('cotture.tipoCottura')
                .select('cotture');

            if (!lavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            return res.json(createResponse(
                true, 
                lavorazione.cotture || []
            ));
        } catch (error) {
            console.error('Errore recupero cotture:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nel recupero cotture",
                error.message
            ));
        }
    },

    /**
     * Aggiunge una nuova cottura alla lavorazione
     */
    addCottura: async (req, res) => {
        try {
            const { id } = req.params;
            const { tipoCottura, temperaturaTarget, addetto } = req.body;

            if (temperaturaTarget && !validateTemperatura(temperaturaTarget)) {
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Temperatura non valida (0-300°C)",
                    "INVALID_TEMPERATURA"
                ));
            }

            const newCottura = {
                tipoCottura,
                temperaturaTarget,
                addetto,
                stato: 'non_iniziata',
                registrazioni: [],
                createdAt: new Date()
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $push: { cotture: newCottura } },
                { new: true, runValidators: true }
            ).populate('cotture.tipoCottura');

            if (!lavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata",
                    "LAVORAZIONE_NOT_FOUND"
                ));
            }

            return res.json(createResponse(
                true, 
                lavorazione.cotture,
                "Cottura aggiunta con successo"
            ));
        } catch (error) {
            console.error('Errore addCottura:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'aggiunta cottura",
                error.message
            ));
        }
    },

    /**
     * Aggiorna una cottura esistente
     */
    updateCottura: async (req, res) => {
        try {
            const { id, cotturaId } = req.params;
            const { tipoCottura, temperaturaTarget, addetto } = req.body;

            if (temperaturaTarget && !validateTemperatura(temperaturaTarget)) {
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Temperatura non valida (0-300°C)",
                    "INVALID_TEMPERATURA"
                ));
            }

            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            });

            if (!lavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione o cottura non trovata",
                    "LAVORAZIONE_NOT_FOUND"
                ));
            }

            const cottura = lavorazione.cotture.id(cotturaId);
            if (cottura.stato === 'completata') {
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Non è possibile modificare una cottura completata",
                    "COTTURA_COMPLETED"
                ));
            }

            const updatedLavorazione = await DettaglioLavorazione.findOneAndUpdate(
                { _id: id, 'cotture._id': cotturaId },
                {
                    $set: {
                        'cotture.$.tipoCottura': tipoCottura,
                        'cotture.$.temperatura': temperaturaTarget,
                        'cotture.$.addetto': addetto,
                        'cotture.$.updatedAt': new Date()
                    }
                },
                { new: true, runValidators: true }
            ).populate('cotture.tipoCottura');

            return res.json(createResponse(
                true, 
                updatedLavorazione.cotture,
                "Cottura aggiornata con successo"
            ));
        } catch (error) {
            console.error('Errore updateCottura:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'aggiornamento cottura",
                error.message
            ));
        }
    },

    /**
     * Avvia una cottura
     */
    startCottura: async (req, res) => {
        try {
            const { id } = req.params;
            const { cotturaId, tipoCottura, temperaturaTarget, addetto } = req.body;

            const updatedLavorazione = await DettaglioLavorazione.findOneAndUpdate(
                { _id: id, 'cotture._id': cotturaId },
                {
                    $set: {
                        'cotture.$.tipoCottura': tipoCottura,
                        'cotture.$.temperaturaTarget': temperaturaTarget,
                        'cotture.$.addetto': addetto,
                        'cotture.$.inizio': new Date(),
                        'cotture.$.stato': 'in_corso'
                    }
                },
                { new: true }
            ).populate('cotture.tipoCottura');

            if (!updatedLavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione o cottura non trovata"
                ));
            }

            return res.json(createResponse(
                true, 
                updatedLavorazione.cotture,
                "Cottura avviata con successo"
            ));
        } catch (error) {
            console.error('Errore startCottura:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nell'avvio della cottura",
                error.message
            ));
        }
    },

    /**
     * Completa una cottura
     */
    completeCottura: async (req, res) => {
        try {
            const { id } = req.params;
            const { cotturaId, temperaturaFinale, verificatoDa } = req.body;

            // Verifica lo stato attuale della cottura
            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            }).populate('cotture.tipoCottura');

            if (!lavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione non trovata"
                ));
            }

            const cottura = lavorazione.cotture.find(c => c._id.toString() === cotturaId);
            
            if (!cottura) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Cottura non trovata"
                ));
            }

            if (cottura.stato !== 'in_corso') {
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "La cottura deve essere in corso per essere completata"
                ));
            }

            // Aggiorna la cottura
            const updatedLavorazione = await DettaglioLavorazione.findOneAndUpdate(
                { _id: id, 'cotture._id': cotturaId },
                {
                    $set: {
                        'cotture.$.stato': 'completata',
                        'cotture.$.fine': new Date(),
                        'cotture.$.temperaturaFinale': temperaturaFinale,
                        'cotture.$.verificatoDa': verificatoDa
                    }
                },
                { new: true }
            ).populate('cotture.tipoCottura');

            return res.json(createResponse(
                true, 
                updatedLavorazione.cotture,
                "Cottura completata con successo"
            ));
        } catch (error) {
            console.error('Errore completeCottura:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nel completamento della cottura",
                error.message
            ));
        }
    },

    /**
     * Rimuove una cottura
     */
    removeCottura: async (req, res) => {
        try {
            const { id, cotturaId } = req.params;

            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            });

            if (!lavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione o cottura non trovata",
                    "LAVORAZIONE_NOT_FOUND"
                ));
            }

            const cottura = lavorazione.cotture.id(cotturaId);
            if (cottura.stato === 'in_corso') {
                return res.status(400).json(createResponse(
                    false, 
                    null, 
                    "Non è possibile rimuovere una cottura in corso",
                    "INVALID_STATE"
                ));
            }

            const updatedLavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $pull: { cotture: { _id: cotturaId } } },
                { new: true }
            ).populate('cotture.tipoCottura');

            return res.json(createResponse(
                true, 
                updatedLavorazione.cotture,
                "Cottura rimossa con successo"
            ));
        } catch (error) {
            console.error('Errore removeCottura:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nella rimozione cottura",
                error.message
            ));
        }
    },

    /**
     * Verifica i parametri HACCP della cottura
     */
    verificaParametriHACCP: async (req, res) => {
        try {
            const { id, cotturaId } = req.params;
            
            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            });

            if (!lavorazione) {
                return res.status(404).json(createResponse(
                    false, 
                    null, 
                    "Lavorazione o cottura non trovata"
                ));
            }

            const cottura = lavorazione.cotture.id(cotturaId);
            
            // Esempio di verifica HACCP (da personalizzare in base alle esigenze)
            const isHACCPCompliant = cottura.temperaturaFinale >= 75; // Esempio: temperatura minima di sicurezza
            
            return res.json(createResponse(
                true, 
                {
                    isHACCPCompliant,
                    parametri: {
                        temperaturaTarget: cottura.temperaturaTarget,
                        temperaturaFinale: cottura.temperaturaFinale,
                        durata: cottura.fine && cottura.inizio ? 
                            Math.round((new Date(cottura.fine) - new Date(cottura.inizio)) / 60000) : 
                            null
                    }
                },
                isHACCPCompliant ? "Parametri HACCP conformi" : "Parametri HACCP non conformi"
            ));
        } catch (error) {
            console.error('Errore verificaParametriHACCP:', error);
            return res.status(500).json(createResponse(
                false, 
                null, 
                "Errore nella verifica dei parametri HACCP",
                error.message
            ));
        }
    }
};

module.exports = cotturaController;
