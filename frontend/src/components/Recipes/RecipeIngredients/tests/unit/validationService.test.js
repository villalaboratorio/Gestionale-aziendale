import { render, screen } from '@testing-library/react';
import { validationService } from '../../services/validationService';

describe('Validation Service', () => {
    const renderValidationTest = (data) => {
        render(<div data-testid="validation-test">{validationService.validateIngredient(data)}</div>);
    };

    test('validates required fields', () => {
        renderValidationTest({});
        expect(screen.getByTestId('validation-test')).toHaveTextContent('Campo obbligatorio');
    });

    test('validates numeric values', () => {
        renderValidationTest({ quantity: -1 });
        expect(screen.getByTestId('validation-test')).toHaveTextContent('Valore non valido');
    });

    test('validates unit selection', () => {
        renderValidationTest({ unit: '' });
        expect(screen.getByTestId('validation-test')).toHaveTextContent('Seleziona unità');
    });
});
