import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../styles/theme';
import IngredientFields from '../../components/IngredientFields';
import { ingredientiService } from '../../services/apiService';

jest.mock('../../services/apiService');

describe('Recipe Ingredients Integration', () => {
    const mockIngredients = [
        {
            _id: '1',
            name: 'Farina',
            quantity: 100,
            unit: 'kg1',
            weightLoss: 0,
            cost: 2.50
        }
    ];

    const mockUnits = [
        { _id: 'kg1', name: 'kg' }
    ];

    beforeEach(() => {
        ingredientiService.getAllIngredients.mockResolvedValue(mockIngredients);
        ingredientiService.getUnits.mockResolvedValue(mockUnits);
    });

    test('flusso completo di aggiunta ingrediente', async () => {
        render(
            <ThemeProvider theme={theme}>
                <IngredientFields recipeId="123" isEditing={true} />
            </ThemeProvider>
        );

        // Attende il caricamento dei dati
        await waitFor(() => {
            expect(screen.getByText('Ingredienti della ricetta')).toBeInTheDocument();
        });

        // Clicca su aggiungi ingrediente
        fireEvent.click(screen.getByText('Aggiungi Ingrediente'));

        // Compila il form
        fireEvent.change(screen.getByRole('combobox', { name: /ingrediente/i }), {
            target: { value: '1' }
        });
        fireEvent.change(screen.getByRole('spinbutton', { name: /quantità/i }), {
            target: { value: '100' }
        });

        // Invia il form
        fireEvent.click(screen.getByText('Aggiungi'));

        // Verifica che l'ingrediente sia stato aggiunto
        await waitFor(() => {
            expect(screen.getByText('Farina')).toBeInTheDocument();
        });
    });
});
