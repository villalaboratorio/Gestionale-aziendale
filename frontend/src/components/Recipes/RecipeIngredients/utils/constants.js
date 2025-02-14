const UNIT_CONVERSIONS = {
    // Peso
    'g': {
        'kg': 0.001,
        'g': 1,
        'mg': 1000,
        'q': 0.00001,
        't': 0.000001
    },
    'kg': {
        'g': 1000,
        'kg': 1,
        'mg': 1000000,
        'q': 0.01,
        't': 0.001
    },
    // ... rest of the conversions
};

const UNIT_TYPES = {
    WEIGHT: ['mg', 'g', 'kg', 'q', 't'],
    VOLUME: ['ml', 'cl', 'dl', 'l', 'hl'],
    UNIT: ['pz', 'dz', 'cf']
};

module.exports = {
    UNIT_TYPES,
    UNIT_CONVERSIONS
};
