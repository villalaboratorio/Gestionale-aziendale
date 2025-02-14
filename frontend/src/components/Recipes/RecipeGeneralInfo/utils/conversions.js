export const UNIT_CONVERSIONS = {
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
    'mg': {
        'g': 0.001,
        'kg': 0.000001,
        'mg': 1,
        'q': 0.00000001,
        't': 0.000000001
    },
    'q': {
        'g': 100000,
        'kg': 100,
        'mg': 100000000,
        'q': 1,
        't': 0.1
    },
    't': {
        'g': 1000000,
        'kg': 1000,
        'mg': 1000000000,
        'q': 10,
        't': 1
    },
    // Volume
    'ml': {
        'l': 0.001,
        'ml': 1,
        'cl': 0.1,
        'dl': 0.01,
        'hl': 0.00001
    },
    'l': {
        'ml': 1000,
        'l': 1,
        'cl': 100,
        'dl': 10,
        'hl': 0.01
    },
    'cl': {
        'ml': 10,
        'l': 0.01,
        'cl': 1,
        'dl': 0.1,
        'hl': 0.0001
    },
    'dl': {
        'ml': 100,
        'l': 0.1,
        'cl': 10,
        'dl': 1,
        'hl': 0.001
    },
    'hl': {
        'ml': 100000,
        'l': 100,
        'cl': 10000,
        'dl': 1000,
        'hl': 1
    },
    // Unità
    'pz': {
        'pz': 1,
        'dz': 0.083333,
        'cf': 0.1
    },
    'dz': {
        'pz': 12,
        'dz': 1,
        'cf': 1.2
    },
    'cf': {
        'pz': 10,
        'dz': 0.833333,
        'cf': 1
    }
};

export const UNIT_TYPES = {
    WEIGHT: ['mg', 'g', 'kg', 'q', 't'],
    VOLUME: ['ml', 'cl', 'dl', 'l', 'hl'],
    UNIT: ['pz', 'dz', 'cf']
};

export const convertUnit = (value, fromUnit, toUnit) => {
    if (!value || fromUnit === toUnit) return Number(value);
    if (!UNIT_CONVERSIONS[fromUnit] || !UNIT_CONVERSIONS[fromUnit][toUnit]) {
        throw new Error(`Conversione non supportata da ${fromUnit} a ${toUnit}`);
    }
    return Number(value) * UNIT_CONVERSIONS[fromUnit][toUnit];
};

export const normalizeToBaseUnit = (value, unit) => {
    const unitType = getUnitType(unit);
    if (!unitType) return Number(value);
    const baseUnit = UNIT_TYPES[unitType][0];
    return convertUnit(value, unit, baseUnit);
};

export const getUnitType = (unit) => {
    return Object.entries(UNIT_TYPES).find(
        ([_, units]) => units.includes(unit)
    )?.[0];
};

export const getAllowedConversions = (fromUnit) => {
    if (!fromUnit) return [];
    const unitType = getUnitType(fromUnit);
    if (!unitType) return [];
    return UNIT_TYPES[unitType].filter(unit => unit !== fromUnit);
};
