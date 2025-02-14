const mongoose = require('mongoose');
const Ricetta = require('../../models/ricettaModel');
const Ingredient = require('../../models/ingredientModel');
const { defaultPopulate, selectFields, paginationOptions, cache, CACHE_TTL, clearCache } = require('../../utils/queryUtils');

exports.getRicettePerIngrediente = async (req, res) => {
    try {
        const nomeIngrediente = req.params.nome;
        console.log('Ricerca ingrediente:', nomeIngrediente);

        const ingrediente = await Ingredient.findOne({
            $or: [
                { nome: nomeIngrediente },
                { name: nomeIngrediente }
            ]
        });

        if (!ingrediente) {
            console.log('Nessun ingrediente trovato');
            return res.json([]);
        }

        const ricette = await Ricetta.find({
            'ingredienti.ingrediente': ingrediente._id
        })
        .populate('ingredienti.ingrediente')
        .lean();

        console.log(`Trovate ${ricette.length} ricette`);
        return res.json(ricette);
    } catch (error) {
        console.error('Errore ricerca ricette:', error);
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllRicette = async (req, res) => {
    try {
        const { page = 1, limit = paginationOptions.limit, search, categoria, difficolta, stagionalita } = req.query;
        
        const query = { isActive: true };
        if (search) query.nome = { $regex: search, $options: 'i' };
        if (categoria) query.categoria = categoria;
        if (difficolta) query.difficolta = difficolta;
        if (stagionalita) query.stagionalita = stagionalita;

        const cacheKey = `ricette:${page}:${limit}:${search}:${categoria}:${difficolta}:${stagionalita}`;
        const cachedResult = cache.get(cacheKey);

        if (cachedResult) {
            console.log('Cache hit for:', cacheKey);
            return res.status(200).json(cachedResult);
        }

        const ricette = await Ricetta.find(query)
            .select(`${selectFields.base} ${selectFields.full}`)
            .populate(defaultPopulate)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(paginationOptions.sort)
            .lean();

        const count = await Ricetta.countDocuments(query);
        
        const result = {
            ricette,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalItems: count,
            itemsPerPage: parseInt(limit)
        };

        cache.set(cacheKey, result);
        setTimeout(() => cache.delete(cacheKey), CACHE_TTL);

        res.status(200).json(result);
    } catch (error) {
        console.error('Errore get ricette:', error);
        res.status(500).json({ message: 'Errore nel recupero delle ricette', error: error.message });
    }
};

exports.getRicettaById = async (req, res) => {
    try {
        const cacheKey = `ricetta:${req.params.id}`;
        const cachedRicetta = cache.get(cacheKey);

        if (cachedRicetta) {
            console.log('Cache hit for:', cacheKey);
            return res.status(200).json(cachedRicetta);
        }

        const ricetta = await Ricetta.findById(req.params.id)
            .select(`${selectFields.base} ${selectFields.full}`)
            .populate(defaultPopulate);
        
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        cache.set(cacheKey, ricetta);
        setTimeout(() => cache.delete(cacheKey), CACHE_TTL);

        res.status(200).json(ricetta);
    } catch (error) {
        console.error('Errore get ricetta:', error);
        res.status(500).json({ 
            message: 'Errore nel recupero della ricetta',
            error: error.message 
        });
    }
};

exports.createRicetta = async (req, res) => {
    try {
        const { _id, ...ricettaData } = req.body;
        
        if (!ricettaData.nome) {
            throw new Error('Il nome della ricetta è obbligatorio');
        }

        if (!ricettaData.categoria) {
            delete ricettaData.categoria;
        }

        const lastRicetta = await Ricetta.findOne()
            .sort({ numeroRicetta: -1 })
            .select('numeroRicetta');
            
        const lastNumber = lastRicetta ? parseInt(lastRicetta.numeroRicetta.slice(3)) : 0;
        const newNumber = (lastNumber + 1).toString().padStart(4, '0');
        const numeroRicetta = `RIC${newNumber}`;

        const ricettaBase = {
            numeroRicetta,
            nome: ricettaData.nome,
            categoria: ricettaData.categoria,
            descrizione: ricettaData.descrizione,
            porzioni: ricettaData.porzioni || 1,
            grammiPerPorzione: ricettaData.grammiPerPorzione || 0,
            pesoTotale: ricettaData.pesoTotale || 0,
            tempoPreparazione: ricettaData.tempoPreparazione,
            tempoCottura: ricettaData.tempoCottura,
            temperatura: ricettaData.temperatura,
            difficolta: ricettaData.difficolta || 'media',
            stagionalita: ricettaData.stagionalita || 'tutto l\'anno',
            ingredienti: [],
            fasi: [],
            cotture: [],
            noteCottura: ricettaData.noteCottura,
            isActive: true
        };

        const nuovaRicetta = await Ricetta.create(ricettaBase);
        clearCache('ricette:');
        
        const ricettaPopulated = await Ricetta.findById(nuovaRicetta._id)
            .select(`${selectFields.base} ${selectFields.full}`)
            .populate(defaultPopulate);
        
        res.status(201).json(ricettaPopulated);
    } catch (error) {
        console.error('Errore creazione ricetta:', error);
        res.status(400).json({ 
            message: 'Errore durante la creazione della ricetta',
            error: error.message 
        });
    }
};

exports.updateRicetta = async (req, res) => {
    try {
        const ricetta = await Ricetta.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true, 
                runValidators: true
            }
        )
        .select(`${selectFields.base} ${selectFields.full}`)
        .populate(defaultPopulate);

        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        cache.delete(`ricetta:${req.params.id}`);
        clearCache('ricette:');

        res.status(200).json(ricetta);
    } catch (error) {
        console.error('Errore aggiornamento ricetta:', error);
        res.status(400).json({ 
            message: 'Errore durante l\'aggiornamento della ricetta',
            error: error.message 
        });
    }
};

exports.deleteRicetta = async (req, res) => {
    try {
        const ricetta = await Ricetta.findByIdAndDelete(req.params.id);
        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        cache.delete(`ricetta:${req.params.id}`);
        clearCache('ricette:');

        res.status(200).json({ 
            message: 'Ricetta eliminata con successo',
            deletedRecipe: ricetta
        });
    } catch (error) {
        console.error('Errore eliminazione ricetta:', error);
        res.status(500).json({ 
            message: 'Errore durante l\'eliminazione della ricetta',
            error: error.message 
        });
    }
};

exports.saveTempRecipe = async (req, res) => {
    try {
        const ricetta = await Ricetta.findByIdAndUpdate(
            req.params.id,
            { 
                ...req.body, 
                lastModified: new Date() 
            },
            { 
                new: true,
                runValidators: true
            }
        ).populate(defaultPopulate);

        if (!ricetta) {
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        res.status(200).json(ricetta);
    } catch (error) {
        console.error('Errore salvataggio temporaneo:', error);
        res.status(400).json({ 
            message: 'Errore durante il salvataggio temporaneo',
            error: error.message 
        });
    }
};
