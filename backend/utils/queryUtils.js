const mongoose = require('mongoose');
const Ricetta = require('../models/ricettaModel');

// Configurazioni di popolazione
const defaultPopulate = [
    { 
        path: 'categoria',
        select: 'name' 
    },
    { 
        path: 'ingredienti.ingrediente',
        select: 'nome categoria' 
    },
    { 
        path: 'ingredienti.unitaMisura',
        select: 'name abbreviation' 
    },
    { 
        path: 'fasi.tipoLavorazione',
        select: 'name' 
    },
    { 
        path: 'fasi.metodo',
        select: 'name' 
    },
    { 
        path: 'cotture.tipoCottura',
        select: 'name' 
    }
];

// Campi da selezionare nelle query
const selectFields = {
    base: 'numeroRicetta nome categoria descrizione porzioni grammiPerPorzione pesoTotale',
    full: 'ingredienti fasi cotture tempoPreparazione tempoCottura temperatura difficolta stagionalita noteCottura',
    exclude: 'createdAt updatedAt __v'
};

// Opzioni di paginazione
const paginationOptions = {
    limit: 20,
    sort: { createdAt: -1 }
};

// Cache utility
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minuti

const clearCache = (pattern) => {
    for (const key of cache.keys()) {
        if (key.startsWith(pattern)) {
            cache.delete(key);
        }
    }
};

module.exports = {
    defaultPopulate,
    selectFields,
    paginationOptions,
    cache,
    CACHE_TTL,
    clearCache
};
