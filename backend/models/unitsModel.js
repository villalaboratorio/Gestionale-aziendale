const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { UNIT_TYPES, UNIT_CONVERSIONS } = require('../costants/conversions');

const UnitsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return UNIT_CONVERSIONS && Object.keys(UNIT_CONVERSIONS).includes(v.toLowerCase());
            },
            message: props => `${props.value} non è un'abbreviazione valida secondo il sistema di conversione`
        }
    },
    type: {
        type: String,
        required: true,
        enum: UNIT_TYPES ? Object.keys(UNIT_TYPES) : [],
        trim: true
    }
});

const Units = mongoose.model('Units', UnitsSchema);
module.exports = Units;
