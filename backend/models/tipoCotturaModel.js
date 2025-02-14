const mongoose = require('mongoose');

const tipoCotturaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TipoCottura', tipoCotturaSchema);

