const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuantityTypesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
});

const QuantityTypes = mongoose.model('QuantityTypes', QuantityTypesSchema);
module.exports = QuantityTypes;
