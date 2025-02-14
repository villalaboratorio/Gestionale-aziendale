const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dettaglioLavorazioneSchema = new Schema({
    // Informazioni Generali
    numeroScheda: { 
        type: String, 
        required: true, 
        unique: true 
    },
    cliente: { 
        type: Schema.Types.ObjectId, 
        ref: 'Cliente', 
        required: true 
    },
    ricetta: { 
        type: Schema.Types.ObjectId, 
        ref: 'Ricetta', 
        required: true 
    },
    tipoLavorazione: { 
        type: Schema.Types.ObjectId, 
        ref: 'ProcessingTypes'  // Aggiornato per usare ProcessingTypes
    },
    statoLavorazione: { 
        type: Schema.Types.ObjectId, 
        ref: 'ProcessingStates'  // Updated from 'StatoLavorazione' to 'ProcessingStates'
    },

    // Date e Priorità
    dataLavorazione: { 
        type: Date, 
        required: true 
    },
    dataConsegnaPrevista: { 
        type: Date, 
        required: true 
    },
    prioritaCliente: { 
        type: String, 
        enum: ['bassa', 'media', 'alta'],
        default: 'media'
    },
    isUrgente: { 
        type: Boolean, 
        default: false 
    },

    // Note
    noteProduzione: String,
    noteAllergeni: String,
    noteConfezionamento: String,

    passaggiLavorazione: [{
        id: {
            type: String,
            required: true
        },
        pelaturaMondatura: {
            oraInizio: Date,
            oraFine: Date,
            operatore: String,
            isStarted: {
                type: Boolean,
                default: false
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        },
        lavaggioPulizia: {
            oraInizio: Date,
            oraFine: Date,
            operatore: String,
            isStarted: {
                type: Boolean,
                default: false
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        },
        taglioMacinaAffetta: {
            oraInizio: Date,
            oraFine: Date,
            operatore: String,
            isStarted: {
                type: Boolean,
                default: false
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        }
    }],

    // Cottura
    cotture: [{
        tipoCottura: { 
            type: Schema.Types.ObjectId, 
            ref: 'TipoCottura' 
        },
        temperaturaTarget: {
            type: Number,
            required: true,
            min: 0,
            max: 300
        },
        addetto: {
            type: String,
            required: true
        },
        stato: {
            type: String,
            enum: ['non_iniziata', 'in_corso', 'completata'],
            default: 'non_iniziata'
        },
        inizio: {
            type: Date
        },
        fine: {
            type: Date
        },
        temperaturaFinale: {
            type: Number,
            min: 0,
            max: 300
        },
        verificatoDa: {
            type: String
        }
    }],    // Abbattimento
    abbattimento: {
        inizio: Date,
        fine: Date,
        temperaturaIniziale: Number,
        temperaturaFinale: Number,
        addetto: String,
        tempoTotale: Number,
        verificaTemperatura: Boolean,
        responsabileVerifica: String
    },

    // Assemblaggio
    assemblaggio: {
        crudo: {
            ore: String,
            addetto: String,
            temperatura: Number,
            controlliQualita: Boolean
        },
        dopoCotturaParziale: {
            ore: String,
            addetto: String,
            temperatura: Number,
            controlliQualita: Boolean
        },
        dopoCotturaCompleta: {
            ore: String,
            addetto: String,
            temperatura: Number,
            controlliQualita: Boolean
        }
    },

    // Conservazione
    conservazione: {
        imballaggio: {
            plastica: Boolean,
            carta: Boolean,
            acciaio: Boolean,
            vetro: Boolean,
            alluminio: Boolean,
            sottovuoto: Boolean,
            altro: String
        },
        metodo: {
            acqua: Boolean,
            liquidoGoverno: Boolean,
            agro: Boolean,
            olio: Boolean,
            altro: String
        },
        temperatura: String,
        inizio: Date,
        fine: Date,
        cella: String,
        shelf_life: Number,
        verificaImballaggio: Boolean,
        responsabileVerifica: String
    },

    // Valori Nutrizionali
    valoriNutrizionali: {
        calorie: Number,
        proteine: Number,
        grassi: Number,
        carboidrati: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DettaglioLavorazione', dettaglioLavorazioneSchema);
