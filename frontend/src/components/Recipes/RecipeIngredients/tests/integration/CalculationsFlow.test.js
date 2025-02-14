import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../styles/theme';
import IngredientFields from '../../components/IngredientFields';

describe('Calculations Flow Integration', () => {
    test('calcolo costi e cali peso', async () => {
        render(
            <ThemeProvider theme={theme}>
                <IngredientFields recipeId="123" isEditing={true} />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Ingredienti della ricetta')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Aggiungi Ingrediente'));
        
        // Add test ingredient
        fireEvent.change(screen.getByLabelText('Quantità'), {
            target: { value: '100' }
        });

        // Verify calculations
        await waitFor(() => {
            const costElement = screen.getByText(/Costo Totale/);
            expect(costElement).toBeInTheDocument();
        });
    });

    test('aggiornamento totali dopo modifiche', async () => {
        render(
            <ThemeProvider theme={theme}>
                <IngredientFields recipeId="123" isEditing={true} />
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Ingredienti della ricetta')).toBeInTheDocument();
        });

        // Test logic for totals update
        fireEvent.click(screen.getByText('Aggiungi Ingrediente'));
        // Add more test interactions
    });
});
