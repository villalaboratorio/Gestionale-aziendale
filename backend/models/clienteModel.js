const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    indirizzo: {
        via: String,
        citta: String,
        cap: String,
        nazione: String
    },
    contatti: {
        telefono: String,
        email: {
            type: String,
            unique: true,  // L'email deve essere unica se presente
            sparse: true   // Consente valori nulli senza violare l'unicità
        }
    },
    partitaIva: {
        type: String,
        required: false // Campo facoltativo
    },
    metodoPagamento: {
        type: String,
        default: 'bonifico bancario'
    }
}, { timestamps: true });

module.exports = mongoose.model('Cliente', clienteSchema);
