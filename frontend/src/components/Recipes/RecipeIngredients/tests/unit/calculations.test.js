import { 
    calculateIngredientCost, 
    calculateWeightLoss, 
    calculateTotalCost 
} from '../../utils/calculations';

describe('Calculations Utilities', () => {
    describe('calculateIngredientCost', () => {
        test('calcola correttamente il costo di un ingrediente', () => {
            const result = calculateIngredientCost(100, 2, 'g', 'kg');
            expect(result).toBe(0.2);
        });

        test('gestisce correttamente valori zero', () => {
            const result = calculateIngredientCost(0, 2, 'g', 'kg');
            expect(result).toBe(0);
        });
    });

    describe('calculateWeightLoss', () => {
        test('calcola correttamente la perdita di peso', () => {
            const result = calculateWeightLoss(100, 80, 'g');
            expect(result).toBe(20);
        });

        test('gestisce correttamente peso iniziale zero', () => {
            const result = calculateWeightLoss(0, 0, 'g');
            expect(result).toBe(0);
        });
    });

    describe('calculateTotalCost', () => {
        const mockIngredients = [
            { quantity: 100, unitPrice: 2, unit: 'g', priceUnit: 'kg' },
            { quantity: 200, unitPrice: 3, unit: 'g', priceUnit: 'kg' }
        ];

        test('calcola correttamente il costo totale', () => {
            const result = calculateTotalCost(mockIngredients);
            expect(result).toBe(0.8); // (0.2 + 0.6)
        });

        test('calcola correttamente il costo con perdite', () => {
            const ingredientsWithLoss = mockIngredients.map(ing => ({
                ...ing,
                weightLoss: 10
            }));
            const result = calculateTotalCost(ingredientsWithLoss, true);
            expect(result).toBe(0.72); // (0.8 * 0.9)
        });
    });
});
