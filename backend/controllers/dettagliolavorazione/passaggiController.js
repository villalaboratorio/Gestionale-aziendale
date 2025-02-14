const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');
const { createResponse } = require('../../utils/responseHelper');

const passaggiController = {
    getPassaggi: async (req, res) => {
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id);
            return res.json(createResponse(true, lavorazione.passaggi));
        } catch (error) {
            return res.status(500).json(createResponse(false, null, error.message));
        }
    },

    addPassaggio: async (req, res) => {
        try {
            const { id } = req.params;
            const nuovoPassaggio = req.body;
            console.log('Nuovo passaggio ricevuto:', nuovoPassaggio);
        
            const lavorazione = await DettaglioLavorazione.findById(id);
            console.log('Lavorazione trovata:', lavorazione);
            if (!lavorazione.passaggi) {
                lavorazione.passaggi = [];
            }
            lavorazione.passaggi.push(nuovoPassaggio);
            await lavorazione.save();
            console.log('Lavorazione salvata:', savedLavorazione);

            return res.status(201).json(createResponse(true, nuovoPassaggio));
        } catch (error) {
            console.error('Errore salvataggio:', error);
            return res.status(500).json(createResponse(false, null, error.message));
        }
    },

    updatePassaggio: async (req, res) => {
        try {
            const { id, passaggioId } = req.params;
            const updateData = req.body;

            const lavorazione = await DettaglioLavorazione.findById(id);
            const passaggio = lavorazione.passaggi.id(passaggioId);
            
            Object.assign(passaggio, updateData);
            await lavorazione.save();

            return res.json(createResponse(true, passaggio));
        } catch (error) {
            return res.status(500).json(createResponse(false, null, error.message));
        }
    },

    deletePassaggio: async (req, res) => {
        try {
            const { id, passaggioId } = req.params;
            
            const lavorazione = await DettaglioLavorazione.findById(id);
            lavorazione.passaggi.id(passaggioId).remove();
            await lavorazione.save();

            return res.json(createResponse(true, { message: 'Passaggio eliminato con successo' }));
        } catch (error) {
            return res.status(500).json(createResponse(false, null, error.message));
        }
    }
};

module.exports = passaggiController;
