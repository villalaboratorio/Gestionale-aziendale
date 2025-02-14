'use strict';

// Dichiarazione esplicita dell'ambiente
const NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const app = express();

// Aggiungi questa configurazione prima del rate limiter
app.set('trust proxy', 1);

// Rate Limiter Configuration
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,    // 5 minuti
    max: 1000,                  // 1000 richieste
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip + req.path  // Differenziamo per endpoint
});
// CORS Configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://192.168.1.235:3000',
        'http://localhost:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware Configuration
app.use(express.json());
app.use(cors(corsOptions));
app.use(limiter);

// Request Logger
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`📡 ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};
app.use(requestLogger);

// Model Registration
const registerModels = async () => {
    console.group('📦 Registrazione Modelli');
    const models = [
        'processingTypesModel',
        'processingStatesModel',
        'clienteModel',
        'ricettaModel',
        'dettaglioLavorazioneModel',
        'fasiMethodModel',
        'fasiTypeModel',
        'tipoCotturaModel'
    ];

    await Promise.all(models.map(async (model) => {
        try {
            await require(`./models/${model}`);
            console.log(`✅ Model "${model}" registrato`);
        } catch (error) {
            console.error(`❌ Errore registrazione ${model}:`, error.message);
        }
    }));
    console.groupEnd();
};

// Routes Configuration
const routes = {
    categoryGoods: require('./routes/categoryGoodsRoutes'),
    categoryRecipes: require('./routes/categoryRecipesRoutes'),
    processingStates: require('./routes/processingStatesRoutes'),
    processingTypes: require('./routes/processingTypesRoutes'),
    units: require('./routes/unitsRoutes'),
    quantityTypes: require('./routes/quantityTypesRoutes'),
    clienti: require('./routes/clienteRoutes'),
    ingredienti: require('./routes/ingredientRoutes'),
    ricette: require('./routes/ricettaRoutes'),
    materiePrime: require('./routes/materiePrimeRoutes'),
    fasiMethods: require('./routes/FasiMethodRoute'),
    fasiTypes: require('./routes/fasiTypeRoutes'),
    tipoCotture: require('./routes/tipoCotturaRoutes')
};

// Mount Routes
const mountRoutes = (app, routes) => {
    console.group('🛣️ Registrazione Route');
    Object.entries(routes).forEach(([key, router]) => {
        if (!router || typeof router !== 'function') {
            console.warn(`⚠️ Router non valido per il percorso ${key}`);
            return;
        }
        const path = `/api/${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        app.use(path, router);
        console.log(`✅ Route "${path}" registrata`);
    });
    console.groupEnd();
};

// Register Routes
mountRoutes(app, routes);

// Special Route for dettaglio-lavorazioni
const dettaglioLavorazioneRoutes = require('./routes/dettaglioLavorazioneRoutes');
app.use('/api/dettaglio-lavorazioni', dettaglioLavorazioneRoutes);

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!', status: 'OK' });
});

// 404 Handler
app.use((req, res) => {
    console.error(`❌ Risorsa non trovata: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: {
            message: 'Resource not found',
            path: req.url
        }
    });
});

// Error Handler
const errorHandler = (err, req, res, next) => {
    console.error('🚨 Errore:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500,
            path: req.path
        }
    });
};
app.use(errorHandler);

// Initialize Application
const initializeApp = async () => {
    try {
        await registerModels();
        await connectDB();
        console.log('✅ Database connesso');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server attivo sulla porta ${PORT}`);
            
            console.group('📍 Route Disponibili');
            app._router.stack
                .filter(r => r.route || r.name === 'router')
                .forEach(r => {
                    if (r.route) {
                        console.log(`${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
                    } else {
                        console.log(`ROUTER ${r.regexp}`);
                    }
                });
            console.groupEnd();
        });
    } catch (error) {
        console.error('❌ Errore inizializzazione:', error);
        process.exit(1);
    }
};

initializeApp();

module.exports = app;
