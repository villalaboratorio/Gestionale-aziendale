import { render, screen,  } from '@testing-library/react';
import IngredientFields from '../../components/IngredientFields';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../styles/theme';

const mockUseIngredientCalculations = jest.fn();
jest.mock('../../hooks/useIngredientCalculations', () => ({
    __esModule: true,
    default: () => mockUseIngredientCalculations()
}));

describe('IngredientFields', () => {
    const defaultProps = {
        recipeId: '123',
        isEditing: true
    };

    const mockHookReturn = {
        ingredienti: [],
        availableIngredients: [],
        units: [],
        totals: { finalCost: 0 },
        loading: false,
        error: null,
        addIngredient: jest.fn(),
        updateCalculations: jest.fn(),
        refreshData: jest.fn()
    };

    beforeEach(() => {
        mockUseIngredientCalculations.mockReturnValue(mockHookReturn);
    });

    test('renderizza correttamente il componente', () => {
        render(
            <ThemeProvider theme={theme}>
                <IngredientFields {...defaultProps} />
            </ThemeProvider>
        );

        expect(screen.getByText('Ingredienti della ricetta')).toBeInTheDocument();
    });

    test('mostra il pulsante aggiungi solo in modalità editing', () => {
        const { rerender } = render(
            <ThemeProvider theme={theme}>
                <IngredientFields {...defaultProps} />
            </ThemeProvider>
        );

        expect(screen.getByText('Aggiungi Ingrediente')).toBeInTheDocument();

        rerender(
            <ThemeProvider theme={theme}>
                <IngredientFields {...defaultProps} isEditing={false} />
            </ThemeProvider>
        );

        expect(screen.queryByText('Aggiungi Ingrediente')).not.toBeInTheDocument();
    });
});
