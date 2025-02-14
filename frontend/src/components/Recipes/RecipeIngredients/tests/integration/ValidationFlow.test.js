import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../styles/theme';
import IngredientFields from '../../components/IngredientFields';

describe('Validation Flow Integration', () => {
    const mockIngredients = [
        { id: '1', name: 'Farina', unit: 'kg' }
    ];

    const renderComponent = () => {
        render(
            <ThemeProvider theme={theme}>
                <IngredientFields 
                    recipeId="123" 
                    isEditing={true}
                    ingredients={mockIngredients}
                />
            </ThemeProvider>
        );
    };

    test('validazione campi vuoti', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Aggiungi Ingrediente'));
        fireEvent.click(screen.getByText('Salva'));
        expect(screen.getByText('Compila tutti i campi obbligatori')).toBeInTheDocument();
    });

    test('validazione quantità negative', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Aggiungi Ingrediente'));
        fireEvent.change(screen.getByLabelText('Quantità'), { target: { value: '-10' } });
        expect(screen.getByText('La quantità deve essere maggiore di 0')).toBeInTheDocument();
    });

    test('validazione unità di misura', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Aggiungi Ingrediente'));
        fireEvent.change(screen.getByLabelText('Unità'), { target: { value: '' } });
        expect(screen.getByText('Seleziona un\'unità di misura')).toBeInTheDocument();
    });
});
