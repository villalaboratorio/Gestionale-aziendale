const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryRecipesSchema = new Schema({
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

const CategoryRecipes = mongoose.model('CategoryRecipes', CategoryRecipesSchema);
module.exports = CategoryRecipes;
