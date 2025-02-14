const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProcessingTypesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
});

const ProcessingTypes = mongoose.model('ProcessingTypes', ProcessingTypesSchema);
module.exports = ProcessingTypes;
