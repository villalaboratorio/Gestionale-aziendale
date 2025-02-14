const Recipe = require('../../models/ricettaModel');
const { CostCalculator, WeightCalculator, Formatter } = require('../../utils/calculations');

exports.getRecipeCosts = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('\n--- Inizio Calcolo Costi ---');
        console.log('ID Ricetta:', id);

        const recipe = await Recipe.findById(id)
            .populate({
                path: 'ingredienti.ingrediente',
                select: 'name cost unit'
            })
            .populate({
                path: 'ingredienti.unitaMisura', 
                select: 'name abbreviazione'
            });

        console.log('\nDati ricetta dopo populate:', JSON.stringify({
            _id: recipe._id,
            nome: recipe.nome,
            porzioni: recipe.porzioni,
            ingredienti: recipe.ingredienti.map(ing => ({
                ingrediente: {
                    _id: ing.ingrediente?._id,
                    name: ing.ingrediente?.name,
                    cost: ing.ingrediente?.cost,
                    unit: ing.ingrediente?.unit
                },
                unitaMisura: {
                    _id: ing.unitaMisura?._id,
                    name: ing.unitaMisura?.name,
                    abbreviazione: ing.unitaMisura?.abbreviazione
                },
                quantita: ing.quantita,
                caloPeso: ing.caloPeso
            }))
        }, null, 2));

        if (!recipe) {
            console.log('Ricetta non trovata');
            return res.status(404).json({ message: 'Ricetta non trovata' });
        }

        if (!recipe.ingredienti || !Array.isArray(recipe.ingredienti)) {
            console.log('Formato ingredienti non valido:', recipe.ingredienti);
            return res.status(400).json({ 
                message: 'Formato ingredienti non valido',
                data: recipe.ingredienti 
            });
        }

        console.log('\nInizio calcolo costi...');
        
        const totalCost = CostCalculator.calculateTotalCost(recipe.ingredienti, true);
        console.log('Costo totale calcolato:', totalCost);

        const costPerServing = CostCalculator.calculateCostPerServing(totalCost, recipe.porzioni);
        console.log('Costo per porzione calcolato:', costPerServing);

        const costsData = {
            ingredients: recipe.ingredienti.map(ing => {
                console.log(`\nCalcolo costo per ingrediente:`, {
                    name: ing.ingrediente?.name,
                    quantita: ing.quantita,
                    costoUnitario: ing.ingrediente?.cost,
                    unitaMisura: ing.unitaMisura?.name,
                    unitaBase: ing.ingrediente?.unit
                });

                const ingredientCost = CostCalculator.calculateIngredientCost(
                    ing.quantita,
                    ing.ingrediente?.cost || 0,
                    ing.unitaMisura?.name,
                    ing.ingrediente?.unit
                );
                console.log('Costo ingrediente calcolato:', ingredientCost);

                return {
                    nome: ing.ingrediente?.name || 'N/D',
                    quantita: ing.quantita,
                    unitaMisura: ing.unitaMisura?.name || 'N/D',
                    caloPeso: ing.caloPeso || 0,
                    costoUnitario: Formatter.formatCurrency(ing.ingrediente?.cost || 0),
                    costoTotale: Formatter.formatCurrency(ingredientCost)
                };
            }),
            total: {
                costoTotale: Formatter.formatCurrency(totalCost),
                costoPerPorzione: Formatter.formatCurrency(costPerServing)
            }
        };

        console.log('\nDati costi finali:', JSON.stringify(costsData, null, 2));
        console.log('--- Fine Calcolo Costi ---\n');

        res.status(200).json(costsData);

    } catch (error) {
        console.error('\nErrore nel calcolo dei costi:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Errore nel calcolo dei costi', 
            error: error.message 
        });
    }
};
