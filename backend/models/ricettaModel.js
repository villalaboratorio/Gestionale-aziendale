const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sottochemi
const FaseSchema = new Schema({
    tipoLavorazione: {
        type: Schema.Types.ObjectId,
        ref: 'FasiType',
        required: true
    },
    metodo: {
        type: Schema.Types.ObjectId,
        ref: 'FasiMethod',
        required: true
    },
    tempo: {
        type: Number,
        min: 0
    },
    descrizione: String,
    ordine: {
        type: Number,
        required: true
    }
});

const IngredienteSchema = new Schema({
    ingrediente: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
    },
    quantita: {
        type: Number,
        required: true,
        min: 0
    },
    unitaMisura: {
        type: Schema.Types.ObjectId,
        ref: 'Units',
        required: true
    },
    caloPeso: {
        type: Number,
        min: 0,
        max: 100
    }
});

const CotturaSchema = new Schema({
    tipoCottura: {
        type: Schema.Types.ObjectId,
        ref: 'TipoCottura',
        required: true
    },
    temperatura: {
        type: Number,
        required: true,
        min: 0,
        max: 500
    },
    tempoCottura: {
        type: Number,
        required: true,
        min: 0
    },
    note: String,
    ordine: {
        type: Number,
        required: true
    }
});

// Schema principale
const RicettaSchema = new Schema({
    numeroRicetta: {
        type: String,
        required: true,
        unique: true
    },
    nome: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryRecipes'
    },
    descrizione: String,
    porzioni: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    grammiPerPorzione: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    pesoTotale: {
        type: Number,
        min: 0,
        default: 0
    },
    tempoPreparazione: {
        type: Number,
        min: 0
    },
    tempoCottura: {
        type: Number,
        min: 0
    },
    temperatura: {
        type: Number,
        min: 0
    },
    difficolta: {
        type: String,
        enum: ['facile', 'media', 'difficile'],
        default: 'media'
    },
    stagionalita: {
        type: String,
        enum: ['primavera', 'estate', 'autunno', 'inverno', 'tutto l\'anno'],
        default: 'tutto l\'anno'
    },
    fasi: [FaseSchema],
    ingredienti: [IngredienteSchema],
    cotture: [CotturaSchema],
    noteCottura: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indici
RicettaSchema.index({ nome: 1 });
RicettaSchema.index({ categoria: 1 });
RicettaSchema.index({ isActive: 1 });
RicettaSchema.index({ 'ingredienti.ingrediente': 1 });
RicettaSchema.index({ numeroRicetta: 1 }, { unique: true });

// Middleware pre-save
RicettaSchema.pre('save', async function(next) {
    if (!this.numeroRicetta) {
        const lastRicetta = await this.constructor.findOne().sort({ numeroRicetta: -1 });
        const lastNumber = lastRicetta ? parseInt(lastRicetta.numeroRicetta.slice(3)) : 0;
        const newNumber = (lastNumber + 1).toString().padStart(4, '0');
        this.numeroRicetta = `RIC${newNumber}`;
    }
    
    // Calcola il peso totale
    if (this.porzioni && this.grammiPerPorzione) {
        this.pesoTotale = this.porzioni * this.grammiPerPorzione;
    }
    
    next();
});

// Middleware pre-find per popolazione automatica
RicettaSchema.pre('find', function() {
    this.populate('categoria')
        .populate('ingredienti.ingrediente')
        .populate('ingredienti.unitaMisura')
        .populate('fasi.tipoLavorazione')
        .populate('fasi.metodo')
        .populate('cotture.tipoCottura');
});

module.exports = mongoose.model('Ricetta', RicettaSchema);
