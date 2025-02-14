import { UNIT_CONVERSIONS, UNIT_TYPES, convertUnit } from '../../utils/conversions';

describe('Unit Conversions', () => {
    test('converts weight units correctly', () => {
        const weightUnits = UNIT_TYPES.WEIGHT;
        weightUnits.forEach(fromUnit => {
            weightUnits.forEach(toUnit => {
                const result = convertUnit(100, fromUnit, toUnit);
                expect(result).toBe(100 * UNIT_CONVERSIONS[fromUnit][toUnit]);
            });
        });
    });

    test('converts volume units correctly', () => {
        const volumeUnits = UNIT_TYPES.VOLUME;
        volumeUnits.forEach(fromUnit => {
            volumeUnits.forEach(toUnit => {
                const result = convertUnit(100, fromUnit, toUnit);
                expect(result).toBe(100 * UNIT_CONVERSIONS[fromUnit][toUnit]);
            });
        });
    });
});
