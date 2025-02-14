const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    barcode: {
        type: String,
        sparse: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
    cost: {
        type: Number,
        required: true
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Units',
        required: true,
        index: true
    },
    nutrition: {
        kcal: {
            type: Number,
            default: 0
        },
        fats: {
            type: Number,
            default: 0
        },
        saturatedFats: {
            type: Number,
            default: 0
        },
        carbohydrates: {
            type: Number,
            default: 0
        },
        sugars: {
            type: Number,
            default: 0
        },
        proteins: {
            type: Number,
            default: 0
        },
        salt: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true
});

IngredientSchema.index({ isActive: 1, name: 1 });
IngredientSchema.index({ isActive: 1, code: 1 });

const Ingredient = mongoose.model('Ingredient', IngredientSchema);
module.exports = Ingredient;
