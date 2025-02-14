const UNIT_TYPES = {
    PESO: ['g', 'kg', 'mg'],
    VOLUME: ['ml', 'l', 'cl'],
    UNITA: ['pz', 'un']
};

const UNIT_CONVERSIONS = {
    'g': { 'kg': 0.001, 'mg': 1000 },
    'kg': { 'g': 1000, 'mg': 1000000 },
    'mg': { 'g': 0.001, 'kg': 0.000001 },
    'ml': { 'l': 0.001, 'cl': 0.1 },
    'l': { 'ml': 1000, 'cl': 100 },
    'cl': { 'ml': 10, 'l': 0.01 }
};

module.exports = {
    UNIT_TYPES,
    UNIT_CONVERSIONS
};
