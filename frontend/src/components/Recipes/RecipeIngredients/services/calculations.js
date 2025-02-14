import { UNIT_CONVERSIONS, UNIT_TYPES } from '../utils/constants';

// Namespace per conversioni unità
const UnitConverter = {
    getConversionFactor: (fromUnit, toUnit) => {
        if (!fromUnit || !toUnit || fromUnit === toUnit) return 1;
        if (!UnitConverter.areUnitsCompatible(fromUnit, toUnit)) return 1;
        return UNIT_CONVERSIONS[fromUnit]?.[toUnit] || 1;
    },

    convertUnit: (value, fromUnit, toUnit) => {
        const factor = UnitConverter.getConversionFactor(fromUnit, toUnit);
        return value * factor;
    },

    areUnitsCompatible: (unit1, unit2) => {
        return Object.values(UNIT_TYPES).some(typeUnits => 
            typeUnits.includes(unit1) && typeUnits.includes(unit2)
        );
    },

    getUnitType: (unit) => {
        return Object.entries(UNIT_TYPES).find(([_, units]) => 
            units.includes(unit)
        )?.[0] || null;
    }
};

// Namespace per calcoli costi
const CostCalculator = {
    calculateIngredientCost: (quantity, unitCost, unitMeasure, baseUnit) => {
        if (!quantity || !unitCost) return 0;
        if (!UnitConverter.areUnitsCompatible(unitMeasure, baseUnit)) return 0;
        const conversionFactor = UnitConverter.getConversionFactor(unitMeasure, baseUnit);
        return quantity * unitCost * conversionFactor;
    },

    calculateTotalCost: (ingredients, includeLoss = false) => {
        if (!ingredients?.length) return 0;

        return ingredients.reduce((total, ingredient) => {
            const baseCost = CostCalculator.calculateIngredientCost(
                ingredient.quantita,
                ingredient.ingrediente?.cost || 0,
                ingredient.unitaMisura,
                ingredient.ingrediente?.unit
            );

            if (!includeLoss) return total + baseCost;

            const lossPercentage = ingredient.caloPeso ? ingredient.caloPeso / 100 : 0;
            const finalCost = baseCost * (1 - lossPercentage);
            
            return total + finalCost;
        }, 0);
    },

    calculateCostPerServing: (totalCost, servings) => {
        if (!totalCost || !servings || servings <= 0) return 0;
        return totalCost / servings;
    },

    calculateIngredientTotals: (ingredients, availableIngredients) => {
        const ingredientCosts = ingredients.reduce((costs, ing) => {
            const selectedIngredient = availableIngredients.find(
                i => i._id === ing.ingrediente
            );
            
            if (selectedIngredient) {
                costs[ing._id] = CostCalculator.calculateIngredientCost(
                    ing.quantita,
                    selectedIngredient.cost,
                    ing.unitaMisura,
                    selectedIngredient.unit
                );
            }
            return costs;
        }, {});

        return {
            rawCost: CostCalculator.calculateTotalCost(ingredients),
            finalCost: CostCalculator.calculateTotalCost(ingredients, true),
            weightLoss: ingredients.reduce((total, ing) => {
                return total + WeightCalculator.calculateWeightLoss(
                    ing.quantita, 
                    ing.caloPeso, 
                    ing.unitaMisura
                );
            }, 0),
            ingredientCosts
        };
    }
};

// Namespace per calcoli peso
const WeightCalculator = {
    calculateWeightLoss: (quantity, weightLoss, unit) => {
        if (!quantity || !weightLoss) return 0;
        if (!UnitConverter.getUnitType(unit)) return 0;
        const lossPercentage = weightLoss / 100;
        return quantity * lossPercentage;
    },

    calculateNetWeight: (quantity, weightLoss) => {
        if (!quantity) return 0;
        const lossPercentage = weightLoss ? weightLoss / 100 : 0;
        return quantity * (1 - lossPercentage);
    },

    calculateTotalYield: (ingredients) => {
        return ingredients.reduce((total, ingredient) => {
            if (!UnitConverter.getUnitType(ingredient.unitaMisura)) return total;
            const netWeight = WeightCalculator.calculateNetWeight(
                ingredient.quantita,
                ingredient.caloPeso
            );
            return total + netWeight;
        }, 0);
    }
};

// Funzioni di formattazione
const Formatter = {
    formatNumber: (value, decimals = 2) => {
        return Number(value).toFixed(decimals);
    },

    formatCurrency: (value) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    },

    formatWeight: (value, unit) => {
        return `${Formatter.formatNumber(value)} ${unit}`;
    },

    formatPercentage: (value) => {
        return `${Formatter.formatNumber(value)}%`;
    }
};

export {
    UnitConverter,
    CostCalculator,
    WeightCalculator,
    Formatter
};
