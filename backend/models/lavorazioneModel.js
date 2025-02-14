const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lavorazioneSchema = new Schema({
    porzioni: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Il numero di porzioni deve essere un intero'
        }
    },
    pesoPorzione: {
        type: Number,
        required: true,
        min: [0, 'Il peso per porzione deve essere positivo']
    },
    quantitaUtilizzata: {
        type: Number,
        required: true,
        min: [0, 'La quantità utilizzata deve essere positiva']
    },
    tipoLavorazione: {
        type: Schema.Types.ObjectId,
        ref: 'ProcessingType',
        required: true
    },
    statoLavorazione: {
        type: Schema.Types.ObjectId,
        ref: 'ProcessingState',
        required: true
    },
    ingredienti: [
        {
            nome: { type: String, required: true },
            quantita: { type: Number, required: true, min: [0, 'La quantità dell\'ingrediente deve essere positiva'] },
            unitaMisura: { type: String, required: true }
        }
    ],
    fasiOperative: [
        {
            nome: { type: String, required: true },
            stato: { 
                type: String, 
                enum: ['non iniziata', 'in corso', 'completata'], 
                default: 'non iniziata' 
            },
            orarioInizio: { 
                type: Date,
                validate: {
                    validator: function(value) {
                        return !this.orarioFine || value <= this.orarioFine;
                    },
                    message: 'L\'orario di inizio deve essere precedente all\'orario di fine'
                }
            },
            orarioFine: { 
                type: Date,
                validate: {
                    validator: function(value) {
                        return !this.orarioInizio || value >= this.orarioInizio;
                    },
                    message: 'L\'orario di fine deve essere successivo all\'orario di inizio'
                }
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Lavorazione', lavorazioneSchema);
