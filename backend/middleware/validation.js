const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    console.group('🔍 Validazione ObjectId');
    console.log('ID ricevuto:', req.params.id);
    
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    console.log('ID valido:', isValid);
    
    console.groupEnd();
    
    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: 'ID non valido'
        });
    }
    next();
};

// Validazione campi richiesti
const validateRequiredFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
            return value === undefined || value === null || value === '';
        });
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Campi obbligatori mancanti: ${missingFields.join(', ')}`
            });
        }
        
        next();
    };
};

// Validazione date
const validateDates = (dateFields) => {
    return (req, res, next) => {
        const invalidDates = dateFields.filter(field => {
            const date = new Date(req.body[field]);
            return isNaN(date.getTime());
        });

        if (invalidDates.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Date non valide nei campi: ${invalidDates.join(', ')}`
            });
        }

        next();
    };
};

// Validazione numeri con range
const validateNumberRange = (field, min, max) => {
    return (req, res, next) => {
        const value = Number(req.body[field]);
        
        if (isNaN(value) || value < min || value > max) {
            return res.status(400).json({
                success: false,
                message: `Il campo ${field} deve essere un numero compreso tra ${min} e ${max}`
            });
        }
        
        next();
    };
};

module.exports = {
    validateObjectId,
    validateRequiredFields,
    validateDates,
    validateNumberRange
};
