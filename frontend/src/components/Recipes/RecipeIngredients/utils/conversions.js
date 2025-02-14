const CONVERSION_RATES = {
    g: 1,
    kg: 1000,
    mg: 0.001,
    lb: 453.592,
    oz: 28.3495
};

export const convertUnit = (value, fromUnit, toUnit = 'g') => {
    if (!value || !fromUnit) return 0;
    
    const fromRate = CONVERSION_RATES[fromUnit.toLowerCase()];
    const toRate = CONVERSION_RATES[toUnit.toLowerCase()];

    if (!fromRate || !toRate) {
        throw new Error(`Unità di misura non supportata: ${fromUnit} o ${toUnit}`);
    }

    return (value * fromRate) / toRate;
};

export const formatUnit = (value, unit) => {
    if (!value || !unit) return '0';
    
    const formattedValue = parseFloat(value).toFixed(2);
    return `${formattedValue} ${unit}`;
};

export const normalizeUnit = (value, unit) => {
    return convertUnit(value, unit, 'g');
};

export const denormalizeUnit = (value, toUnit) => {
    return convertUnit(value, 'g', toUnit);
};
