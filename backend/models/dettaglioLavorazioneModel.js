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
    operatore: {
        type: String,
        default: ''
    },
    motivazioneUrgenza: {
        type: String,
        default: ''
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
            },
            note: String  // Aggiungiamo il campo note
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
            },
            note: String  // Aggiungiamo il campo note
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
            },
            note: String  // Aggiungiamo il campo note
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
            controlliQualita: Boolean,
            stato: {
                type: String,
                enum: ['non_iniziata', 'in_corso', 'completata'],
                default: 'non_iniziata'
            },
            dataCompletamento: Date,
            note: String
        },
        dopoCottura: {
            ore: String,
            addetto: String,
            temperatura: Number,
            controlliQualita: Boolean,
            stato: {
                type: String,
                enum: ['non_iniziata', 'in_corso', 'completata'],
                default: 'non_iniziata'
            },
            dataCompletamento: Date,
            note: String
        },
        dopoCotturaParziale: {
            ore: String,
            addetto: String,
            temperatura: Number,
            controlliQualita: Boolean,
            stato: {
                type: String,
                enum: ['non_iniziata', 'in_corso', 'completata'],
                default: 'non_iniziata'
            },
            dataCompletamento: Date,
            note: String
        },
        crudoSegueCottura: {
            ore: String,
            addetto: String,
            temperatura: Number,
            controlliQualita: Boolean,
            stato: {
                type: String,
                enum: ['non_iniziata', 'in_corso', 'completata'],
                default: 'non_iniziata'
            },
            dataCompletamento: Date,
            note: String
        }
    },
//  definizione dell'oggetto abbattimento
abbattimento: {
    inizio: Date,
    fine: Date,
    temperaturaIniziale: Number,
    temperaturaFinale: Number,
    addetto: String,
    tempoTotale: Number,
    verificaTemperatura: Boolean,
    responsabileVerifica: String,
    note: String,
    stato: {
        type: String,
        enum: ['non_iniziato', 'in_corso', 'completato'],
        default: 'non_iniziato'
    },
    validazione: {
        isValidato: Boolean,
        valutazione: {
            type: String,
            enum: ['ottimale', 'veloce', 'lento']
        },
        note: String
    },
    // Aggiungi questi nuovi campi
    tempoResiduoStimato: Number,
    dataFineStimata: Date,
    readings: [{
        timestamp: Date,
        temperatura: Number
    }],
    tipoAlimento: {
        type: String,
        enum: ['LIQUIDS', 'LIGHT_SOLID', 'MEDIUM_SOLID', 'DENSE_SOLID', 'FROZEN', 'CUSTOM'],
        default: 'MEDIUM_SOLID'
    },
    tipoAbbattimento: {
        type: String,
        enum: ['positivo', 'negativo'],
        default: 'positivo'
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
// Informazioni Porzioni e Peso
porzioniPreviste: { 
    type: Number, 
    min: 0,
    default: 0
},
grammiPerPorzione: { 
    type: Number, 
    min: 0,
    default: 0
},
pesoTotale: {
    type: Number,
    min: 0,
    default: 0
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
