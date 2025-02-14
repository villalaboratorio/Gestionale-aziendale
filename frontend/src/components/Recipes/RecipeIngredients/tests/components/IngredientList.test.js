import { render, screen } from '@testing-library/react';
import IngredientList from '../../components/IngredientList';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../styles/theme';

describe('IngredientList', () => {
    const mockProps = {
        ingredients: [
            {
                _id: '1',
                name: 'Farina',
                quantity: 100,
                unit: 'kg1',
                weightLoss: 0,
                cost: 2.50
            }
        ],
        units: [{ _id: 'kg1', name: 'kg' }],
        totals: { finalCost: 2.50 },
        isEditing: true,
        onUpdate: jest.fn(),
        onRemove: jest.fn()
    };

    test('renderizza correttamente la lista degli ingredienti', () => {
        render(
            <ThemeProvider theme={theme}>
                <IngredientList {...mockProps} />
            </ThemeProvider>
        );

        expect(screen.getByText('Farina')).toBeInTheDocument();
        expect(screen.getByText('100 kg')).toBeInTheDocument();
        expect(screen.getByText('€ 2.50')).toBeInTheDocument();
    });
});
