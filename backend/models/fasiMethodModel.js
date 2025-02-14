const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fasiMethodSchema = new Schema({
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
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FasiMethod', fasiMethodSchema);
