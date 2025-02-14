const validateIngredient = (data) => {
    const errors = {};

    // Validazione ingrediente
    if (!data.ingrediente) {
        errors.ingrediente = 'L\'ingrediente è obbligatorio';
    }

    // Validazione quantità
    if (!data.quantita || data.quantita <= 0) {
        errors.quantita = 'La quantità deve essere maggiore di 0';
    }

    // Validazione unità di misura
    if (!data.unitaMisura) {
        errors.unitaMisura = 'L\'unità di misura è obbligatoria';
    }

    // Validazione calo peso
    if (data.caloPeso) {
        const caloPeso = parseFloat(data.caloPeso);
        if (isNaN(caloPeso) || caloPeso < 0 || caloPeso > 100) {
            errors.caloPeso = 'Il calo peso deve essere compreso tra 0 e 100';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

const validateIngredientList = (ingredients) => {
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
    validateIngredientList
};

export default validationService;
