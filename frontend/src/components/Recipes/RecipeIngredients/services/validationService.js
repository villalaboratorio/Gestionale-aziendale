import { UNIT_TYPES } from '../utils/constants';

const ValidationRules = {
    required: (value, fieldName) => ({
        isValid: value !== undefined && value !== null && value !== '',
        error: `${fieldName} è obbligatorio`
    }),

    number: (value, fieldName) => ({
        isValid: !isNaN(value) && value !== null && value !== undefined,
        error: `${fieldName} deve essere un numero valido`
    }),

    positive: (value, fieldName) => ({
        isValid: value > 0,
        error: `${fieldName} deve essere maggiore di zero`
    }),

    range: (value, fieldName, min, max) => ({
        isValid: value >= min && value <= max,
        error: `${fieldName} deve essere compreso tra ${min} e ${max}`
    }),

    validUnit: (value, fieldName) => ({
        isValid: Object.values(UNIT_TYPES).flat().includes(value),
        error: `${fieldName} non è un'unità di misura valida`
    }),

    caloPeso: (value) => ({
        isValid: value >= 0 && value <= 100,
        error: 'Il calo peso deve essere compreso tra 0 e 100%'
    }),

    compatibleUnits: (ingredients) => ({
        isValid: ingredients.length === 0 || ingredients.every(ing => 
            ing.unitaMisura.type === ingredients[0].unitaMisura.type
        ),
        error: 'Le unità di misura degli ingredienti devono essere compatibili'
    }),

    validCalculations: (totals) => ({
        isValid: totals.rawCost >= 0 && totals.finalCost >= 0,
        error: 'Errore nel calcolo dei costi'
    }),

    validIngredientReference: (ingredient) => ({
        isValid: ingredient && ingredient._id,
        error: 'Riferimento ingrediente non valido'
    }),

    validUnitReference: (unit) => ({
        isValid: unit && unit._id,
        error: 'Riferimento unità di misura non valido'
    })
};

const validateIngredient = (data) => {
    const errors = {};

    // Validazione ingrediente
    if (!ValidationRules.required(data.ingrediente, 'Ingrediente').isValid) {
        errors.ingrediente = ValidationRules.required(data.ingrediente, 'Ingrediente').error;
    } else if (!ValidationRules.validIngredientReference(data.ingrediente).isValid) {
        errors.ingrediente = ValidationRules.validIngredientReference(data.ingrediente).error;
    }

    // Validazione quantità
    if (!ValidationRules.required(data.quantita, 'Quantità').isValid) {
        errors.quantita = ValidationRules.required(data.quantita, 'Quantità').error;
    } else if (!ValidationRules.number(data.quantita, 'Quantità').isValid) {
        errors.quantita = ValidationRules.number(data.quantita, 'Quantità').error;
    } else if (!ValidationRules.positive(data.quantita, 'Quantità').isValid) {
        errors.quantita = ValidationRules.positive(data.quantita, 'Quantità').error;
    }

    // Validazione unità di misura
    if (!ValidationRules.required(data.unitaMisura, 'Unità di misura').isValid) {
        errors.unitaMisura = ValidationRules.required(data.unitaMisura, 'Unità di misura').error;
    } else if (!ValidationRules.validUnitReference(data.unitaMisura).isValid) {
        errors.unitaMisura = ValidationRules.validUnitReference(data.unitaMisura).error;
    }

    // Validazione calo peso
    if (data.caloPeso !== undefined && data.caloPeso !== '') {
        if (!ValidationRules.number(data.caloPeso, 'Calo peso').isValid) {
            errors.caloPeso = ValidationRules.number(data.caloPeso, 'Calo peso').error;
        } else if (!ValidationRules.caloPeso(data.caloPeso).isValid) {
            errors.caloPeso = ValidationRules.caloPeso(data.caloPeso).error;
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validateIngredientsList = (ingredients) => {
    if (!ValidationRules.compatibleUnits(ingredients).isValid) {
        return {
            isValid: false,
            error: ValidationRules.compatibleUnits(ingredients).error
        };
    }

    const errors = [];
    ingredients.forEach((ingredient, index) => {
        const validation = validateIngredient(ingredient);
        if (!validation.isValid) {
            errors.push({
                index,
                errors: validation.errors
            });
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validationService = {
    validateIngredient,
    validateIngredientsList,
    ValidationRules
};

export default validationService;
