const Lavorazione = require('../models/lavorazioneModel');
const Cliente = require('../models/clienteModel');
const Ricetta = require('../models/ricettaModel');
const TipoLavorazione = require('../models/tipoLavorazioneModel');
const StatoLavorazione = require('../models/statoLavorazioneModel');

// Funzione helper per recuperare le collections
const getCollections = async () => {
    const [clienti, ricette, tipiLavorazione, statiLavorazione] = await Promise.all([
        Cliente.find().select('nome email telefono').lean(),
        Ricetta.find().select('nome descrizione').lean(),
        TipoLavorazione.find().lean(),
        StatoLavorazione.find().lean()
    ]);

    return { clienti, ricette, tipiLavorazione, statiLavorazione };
};

exports.getAggregatedLavorazioni = async (req, res) => {
    console.log('📊 Richiesta getAggregatedLavorazioni');
    try {
        const [lavorazioni, collections] = await Promise.all([
            Lavorazione.find({}, 'numeroScheda cliente statoLavorazione tipoLavorazione ricetta createdAt')
                .populate('cliente', 'nome')
                .populate('tipoLavorazione', 'name')
                .populate('statoLavorazione', 'name')
                .populate('ricetta', 'nome')
                .lean(),
            getCollections()
        ]);

        console.log(`✅ Recuperate ${lavorazioni.length} lavorazioni aggregate`);
        res.status(200).json({ lavorazioni, collections });
    } catch (error) {
        console.error("❌ Errore nel recupero delle lavorazioni aggregate:", error);
        res.status(500).json({ message: 'Errore nel recupero delle lavorazioni' });
    }
};

exports.getLavorazioneById = async (req, res) => {
    const { id } = req.params;
    console.log(`🔍 Richiesta getLavorazioneById: ${id}`);
    
    try {
        const [lavorazione, collections] = await Promise.all([
            Lavorazione.findById(id)
                .populate({
                    path: 'cliente',
                    select: 'nome email telefono indirizzo'
                })
                .populate('tipoLavorazione')
                .populate('statoLavorazione')
                .populate({
                    path: 'ricetta',
                    populate: {
                        path: 'ingredienti.ingrediente'
                    }
                })
                .lean(),
            getCollections()
        ]);

        console.log(`🔎 Risultato ricerca lavorazione:`, {
            trovata: !!lavorazione,
            id: lavorazione?._id,
            cliente: lavorazione?.cliente?.nome,
            stato: lavorazione?.statoLavorazione?.name
        });

        if (!lavorazione) {
            return res.status(404).json({ message: 'Lavorazione non trovata' });
        }

        res.status(200).json({ lavorazione, collections });
    } catch (error) {
        console.error("❌ Errore nel recupero della lavorazione:", error);
        res.status(500).json({ message: 'Errore nel recupero della lavorazione' });
    }
};

// Il resto del controller rimane invariato ma aggiungiamo collections nelle risposte

exports.createLavorazione = async (req, res) => {
    // ... codice esistente ...
    const collections = await getCollections();
    res.status(201).json({
        message: 'Lavorazione creata con successo',
        lavorazione: nuovaLavorazione,
        collections
    });
};

exports.updateLavorazione = async (req, res) => {
    // ... codice esistente ...
    const collections = await getCollections();
    res.status(200).json({
        message: 'Lavorazione aggiornata con successo',
        lavorazione: updatedLavorazione,
        collections
    });
};

exports.deleteLavorazione = async (req, res) => {
    // ... codice esistente ma modifichiamo la risposta ...
    res.status(200).json({ 
        message: 'Lavorazione eliminata con successo',
        id: deletedLavorazione._id
    });
};
