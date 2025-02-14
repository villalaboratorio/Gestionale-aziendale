const baseController = require('./baseController');
const ingredientsController = require('./ingredientsController');
const stepsController = require('./stepsController');
const cookingController = require('./cookingController');
const costController = require('./costController');

module.exports = {
    // Base operations
    getAllRicette: baseController.getAllRicette,
    getRicettaById: baseController.getRicettaById,
    createRicetta: baseController.createRicetta,
    updateRicetta: baseController.updateRicetta,
    deleteRicetta: baseController.deleteRicetta,

    // Ingredients operations
    getIngredienti: ingredientsController.getIngredienti,
    addIngrediente: ingredientsController.addIngrediente,
    updateIngrediente: ingredientsController.updateIngrediente,
    deleteIngrediente: ingredientsController.deleteIngrediente,
    saveTempIngredienti: ingredientsController.saveTempIngredienti,

    // Steps operations
    getFasi: stepsController.getFasi,
    addFase: stepsController.addFase,
    updateFase: stepsController.updateFase,
    deleteFase: stepsController.deleteFase,
    reorderFasi: stepsController.reorderFasi,
    saveTempFasi: stepsController.saveTempFasi,

    // Cooking operations
    getCotture: cookingController.getCotture,
    addCottura: cookingController.addCottura,
    updateCottura: cookingController.updateCottura,
    deleteCottura: cookingController.deleteCottura,
    reorderCotture: cookingController.reorderCotture,

    // Cost operations
    getRecipeCosts: costController.getRecipeCosts
};
