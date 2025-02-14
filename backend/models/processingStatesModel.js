const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProcessingStatesSchema = new Schema({
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

const ProcessingStates = mongoose.model('ProcessingStates', ProcessingStatesSchema);
module.exports = ProcessingStates;

