const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: [1, 'La quantità deve essere almeno 1']
    },
    unit: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Units',  
        required: true 
    },
    lotNumber: { 
        type: String,
        required: true
    }
}, { _id: false });

const PrelievoSchema = new mongoose.Schema({
    quantitaPrelevata: { type: Number, required: true },
    dataPrelievo: { type: Date, required: true, default: Date.now },
    numeroPorzioni: { type: Number, required: true },
    grammiPerPorzione: { type: Number, required: true },
    quantitaResidua: { type: Number, required: true },
    lotNumber: { type: String, required: true },
    destinazioneLavorazione: { type: mongoose.Schema.Types.ObjectId, ref: 'DettaglioLavorazione' }
});


const MateriePrimeSchema = new mongoose.Schema({
    documentNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    date: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    cliente: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cliente',  
        required: true 
    },  
    products: { 
        type: [ProductSchema],  
        validate: {
            validator: function(products) {
                return products.length > 0;  
            },
            message: 'Devi aggiungere almeno un prodotto.'
        }
    },
    documentFile: { 
        type: String
    },
    quantitaIniziale: { 
        type: Number, 
        required: true 
    },
    quantitaResidua: { 
        type: Number, 
        required: true 
    },
    prelievi: [PrelievoSchema]
}, { timestamps: true });

module.exports = mongoose.model('MateriaPrima', MateriePrimeSchema);
