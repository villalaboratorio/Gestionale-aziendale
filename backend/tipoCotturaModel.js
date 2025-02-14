const mongoose = require('mongoose');

const tipoCotturaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    temperaturaMin: {
        type: Number,
        required: false
    },
    temperaturaMax: {
        type: Number,
        required: false
    },
    tempoMedioCottura: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TipoCottura', tipoCotturaSchema);
