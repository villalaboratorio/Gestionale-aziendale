const mongoose = require('mongoose');
const Ricetta = require('../../models/ricettaModel');

const populateCotture = [
    { path: 'cotture.tipoCottura' }
];

exports.getCotture = async (req, res) => {
    try {
        const ricetta = await Ricetta.findById(req.params.id)
            .populate(populateCotture);

        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        res.status(200).json(ricetta.cotture);
    } catch (error) {
        console.error('Errore get cotture:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.addCottura = async (req, res) => {
    try {
        const ricetta = await Ricetta.findById(req.params.id);
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        const { tipoCottura, temperatura, tempoCottura, note } = req.body;
        if (!tipoCottura || !temperatura || !tempoCottura) {
            return res.status(400).json({ message: 'Dati cottura incompleti' });
        }

        const nuovaCottura = {
            tipoCottura,
            temperatura: Number(temperatura),
            tempoCottura: Number(tempoCottura),
            note,
            ordine: ricetta.cotture.length
        };

        ricetta.cotture.push(nuovaCottura);
        await ricetta.save();

        const ricettaAggiornata = await Ricetta.findById(req.params.id)
            .populate(populateCotture);

        res.status(201).json(ricettaAggiornata.cotture);
    } catch (error) {
        console.error('Errore aggiunta cottura:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.updateCottura = async (req, res) => {
    try {
        const ricetta = await Ricetta.findById(req.params.id);
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        const cotturaIndex = ricetta.cotture.findIndex(
            c => c._id.toString() === req.params.cotturaId
        );

        if (cotturaIndex === -1) {
            return res.status(404).json({ message: 'Cottura non trovata' });
        }

        const { tipoCottura, temperatura, tempoCottura, note } = req.body;
        if (!tipoCottura || !temperatura || !tempoCottura) {
            return res.status(400).json({ message: 'Dati cottura incompleti' });
        }

        ricetta.cotture[cotturaIndex] = {
            ...ricetta.cotture[cotturaIndex].toObject(),
            tipoCottura,
            temperatura: Number(temperatura),
            tempoCottura: Number(tempoCottura),
            note,
            ordine: cotturaIndex
        };

        await ricetta.save();

        const ricettaAggiornata = await Ricetta.findById(req.params.id)
            .populate(populateCotture);

        res.status(200).json(ricettaAggiornata.cotture);
    } catch (error) {
        console.error('Errore aggiornamento cottura:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCottura = async (req, res) => {
    try {
        const ricetta = await Ricetta.findById(req.params.id);
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        const cotturaIndex = ricetta.cotture.findIndex(
            c => c._id.toString() === req.params.cotturaId
        );

        if (cotturaIndex === -1) {
            return res.status(404).json({ message: 'Cottura non trovata' });
        }

        ricetta.cotture.splice(cotturaIndex, 1);
        ricetta.cotture = ricetta.cotture.map((cottura, index) => ({
            ...cottura.toObject(),
            ordine: index
        }));

        await ricetta.save();

        const ricettaAggiornata = await Ricetta.findById(req.params.id)
            .populate(populateCotture);

        res.status(200).json(ricettaAggiornata.cotture);
    } catch (error) {
        console.error('Errore eliminazione cottura:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.reorderCotture = async (req, res) => {
    try {
        const ricetta = await Ricetta.findById(req.params.id);
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        const { newOrder } = req.body;
        if (!Array.isArray(newOrder)) {
            return res.status(400).json({ message: 'Formato ordine non valido' });
        }

        const cottureRiordinate = newOrder.map((oldIndex, newIndex) => ({
            ...ricetta.cotture[oldIndex].toObject(),
            ordine: newIndex
        }));

        ricetta.cotture = cottureRiordinate;
        await ricetta.save();

        const ricettaAggiornata = await Ricetta.findById(req.params.id)
            .populate(populateCotture);

        res.status(200).json(ricettaAggiornata.cotture);
    } catch (error) {
        console.error('Errore riordinamento cotture:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.saveTempCotture = async (req, res) => {
    try {
        const ricetta = await Ricetta.findById(req.params.id);
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        const { cotture } = req.body;
        if (!Array.isArray(cotture)) {
            return res.status(400).json({ message: 'Formato cotture non valido' });
        }

        const cottureValidate = cotture.map((cottura, index) => ({
            tipoCottura: cottura.tipoCottura,
            temperatura: Number(cottura.temperatura),
            tempoCottura: Number(cottura.tempoCottura),
            note: cottura.note,
            ordine: index
        }));

        ricetta.cotture = cottureValidate;
        await ricetta.save();

        const ricettaAggiornata = await Ricetta.findById(req.params.id)
            .populate(populateCotture);

        res.status(200).json(ricettaAggiornata.cotture);
    } catch (error) {
        console.error('Errore salvataggio cotture temporanee:', error);
        res.status(500).json({ message: error.message });
    }
};
