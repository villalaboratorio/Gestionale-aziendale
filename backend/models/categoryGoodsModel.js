const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definizione dello schema per CategoryGoods
const CategoryGoodsSchema = new Schema({
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

// Creazione del modello
const CategoryGoods = mongoose.model('CategoryGoods', CategoryGoodsSchema);

// Esportazione del modello
module.exports = CategoryGoods;
