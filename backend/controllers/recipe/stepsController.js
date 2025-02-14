const mongoose = require('mongoose');
const Ricetta = require('../../models/ricettaModel');

const populateFasi = [
    { path: 'fasi.tipoLavorazione' },
    { path: 'fasi.metodo' }
];

const stepsController = {
    getFasi: async (req, res) => {
        try {
            const ricetta = await Ricetta.findById(req.params.id)
                .populate(populateFasi);

            if (!ricetta) {
                return res.status(404).json({ message: 'Ricetta non trovata' });
            }

            res.status(200).json(ricetta.fasi);
        } catch (error) {
            console.error('Errore get fasi:', error);
            res.status(500).json({ message: error.message });
        }
    },

    addFase: async (req, res) => {
        try {
            const ricetta = await Ricetta.findById(req.params.id);
            if (!ricetta) {
                return res.status(404).json({ message: 'Ricetta non trovata' });
            }

            const { tipoLavorazione, metodo, tempo, descrizione } = req.body;
            if (!tipoLavorazione || !metodo) {
                return res.status(400).json({ message: 'Dati fase incompleti' });
            }

            const nuovaFase = {
                tipoLavorazione,
                metodo,
                tempo: tempo ? Number(tempo) : 0,
                descrizione,
                ordine: ricetta.fasi.length
            };

            ricetta.fasi.push(nuovaFase);
            await ricetta.save();

            const ricettaAggiornata = await Ricetta.findById(req.params.id)
                .populate(populateFasi);

            res.status(201).json(ricettaAggiornata.fasi);
        } catch (error) {
            console.error('Errore aggiunta fase:', error);
            res.status(400).json({ message: error.message });
        }
    },

    updateFase: async (req, res) => {
        try {
            const ricetta = await Ricetta.findById(req.params.id);
            if (!ricetta) {
                return res.status(404).json({ message: 'Ricetta non trovata' });
            }

            const faseIndex = parseInt(req.params.faseIndex);
            if (faseIndex >= ricetta.fasi.length) {
                return res.status(404).json({ message: 'Fase non trovata' });
            }

            const { tipoLavorazione, metodo, tempo, descrizione } = req.body;
            if (!tipoLavorazione || !metodo) {
                return res.status(400).json({ message: 'Dati fase incompleti' });
            }

            ricetta.fasi[faseIndex] = {
                ...ricetta.fasi[faseIndex].toObject(),
                tipoLavorazione,
                metodo,
                tempo: tempo ? Number(tempo) : 0,
                descrizione,
                ordine: faseIndex
            };

            await ricetta.save();

            const ricettaAggiornata = await Ricetta.findById(req.params.id)
                .populate(populateFasi);

            res.status(200).json(ricettaAggiornata.fasi);
        } catch (error) {
            console.error('Errore aggiornamento fase:', error);
            res.status(400).json({ message: error.message });
        }
    },

    deleteFase: async (req, res) => {
        try {
            const ricetta = await Ricetta.findById(req.params.id);
            if (!ricetta) {
                return res.status(404).json({ message: 'Ricetta non trovata' });
            }

            const faseIndex = parseInt(req.params.faseIndex);
            if (faseIndex >= ricetta.fasi.length) {
                return res.status(404).json({ message: 'Fase non trovata' });
            }

            ricetta.fasi.splice(faseIndex, 1);
            ricetta.fasi = ricetta.fasi.map((fase, index) => ({
                ...fase.toObject(),
                ordine: index
            }));
            
            await ricetta.save();

            const ricettaAggiornata = await Ricetta.findById(req.params.id)
                .populate(populateFasi);

            res.status(200).json(ricettaAggiornata.fasi);
        } catch (error) {
            console.error('Errore eliminazione fase:', error);
            res.status(400).json({ message: error.message });
        }
    },

    reorderFasi: async (req, res) => {
        try {
            const ricetta = await Ricetta.findById(req.params.id);
            if (!ricetta) {
                return res.status(404).json({ message: 'Ricetta non trovata' });
            }

            const { newOrder } = req.body;
            if (!Array.isArray(newOrder)) {
                return res.status(400).json({ message: 'Formato ordine non valido' });
            }

            const fasiRiordinate = newOrder.map((oldIndex, newIndex) => ({
                ...ricetta.fasi[oldIndex].toObject(),
                ordine: newIndex
            }));

            ricetta.fasi = fasiRiordinate;
            await ricetta.save();

            const ricettaAggiornata = await Ricetta.findById(req.params.id)
                .populate(populateFasi);

            res.status(200).json(ricettaAggiornata.fasi);
        } catch (error) {
            console.error('Errore riordinamento fasi:', error);
            res.status(400).json({ message: error.message });
        }
    },

    saveTempFasi: async (req, res) => {
        try {
            const { id: ricettaId } = req.params;
            const fasi = req.body;

            const ricetta = await Ricetta.findById(ricettaId);
            if (!ricetta) {
                return res.status(404).json({ message: 'Ricetta non trovata' });
            }

            if (!Array.isArray(fasi)) {
                return res.status(400).json({ message: 'Formato fasi non valido - deve essere un array' });
            }

            const fasiValidate = fasi.map((fase, index) => ({
                tipoLavorazione: fase.tipoLavorazione,
                metodo: fase.metodo,
                tempo: fase.tempo ? Number(fase.tempo) : 0,
                descrizione: fase.descrizione,
                ordine: index
            }));

            ricetta.fasi = fasiValidate;
            await ricetta.save();

            const ricettaAggiornata = await Ricetta.findById(ricettaId)
                .populate(populateFasi);

            res.status(200).json(ricettaAggiornata.fasi);
        } catch (error) {
            console.error('Errore salvataggio fasi temporanee:', error);
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = stepsController;
