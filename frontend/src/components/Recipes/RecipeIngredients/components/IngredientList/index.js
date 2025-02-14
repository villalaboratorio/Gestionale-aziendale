import React from 'react';
import { FaTrash } from 'react-icons/fa';
import {
    ListContainer,
    ListHeader,
    ListBody,
    Row,
    Cell,
    DeleteButton,
    TotalsSection,
    TotalRow,
    TotalLabel,
    TotalValue,
    Select
} from './styles';

const IngredientList = ({
    ingredients,
    availableIngredients,
    units,
    totals,
    isEditing,
    onUpdate,
    onRemove
}) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const renderIngredientRow = (ingredient, index) => {
        if (!ingredient || !ingredient.ingrediente) return null;

        const ingredientId = ingredient.ingrediente._id || ingredient.ingrediente;
        const selectedIngredient = availableIngredients?.find(i => i._id === ingredientId);
        const unitId = ingredient.unitaMisura?._id || ingredient.unitaMisura;
        const selectedUnit = units?.find(u => u._id === unitId);

        if (!selectedIngredient) return null;

        return (
            <Row key={ingredient._id || `temp-${index}`}>
                <Cell>
                    {isEditing ? (
                        <Select
                            value={ingredientId}
                            onChange={(e) => onUpdate(index, 'ingrediente', e.target.value)}
                        >
                            {availableIngredients.map(ing => (
                                <option key={ing._id} value={ing._id}>
                                    {ing.name}
                                </option>
                            ))}
                        </Select>
                    ) : (
                        selectedIngredient.name
                    )}
                </Cell>
                <Cell>
                    {isEditing ? (
                        <input
                            type="number"
                            value={ingredient.quantita || 0}
                            onChange={(e) => onUpdate(index, 'quantita', e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    ) : ingredient.quantita || 0}
                </Cell>
                <Cell>{selectedUnit?.abbreviation || 'N/A'}</Cell>
                <Cell>
                    {isEditing ? (
                        <input
                            type="number"
                            value={ingredient.caloPeso || 0}
                            onChange={(e) => onUpdate(index, 'caloPeso', e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    ) : ingredient.caloPeso || 0}
                </Cell>
                <Cell>
                    {formatCurrency((selectedIngredient?.cost || 0) * (ingredient.quantita || 0))}
                </Cell>
                {isEditing && (
                    <Cell>
                        <DeleteButton onClick={() => onRemove(index)}>
                            <FaTrash />
                        </DeleteButton>
                    </Cell>
                )}
            </Row>
        );
    };

    return (
        <>
            <ListContainer>
                <ListHeader>
                    <Row>
                        <Cell>Ingrediente</Cell>
                        <Cell>Quantità</Cell>
                        <Cell>Unità</Cell>
                        <Cell>Calo Peso (%)</Cell>
                        <Cell>Costo</Cell>
                        {isEditing && <Cell>Azioni</Cell>}
                    </Row>
                </ListHeader>
                <ListBody>
                    {ingredients?.map((ingredient, index) => 
                        renderIngredientRow(ingredient, index)
                    )}
                </ListBody>
            </ListContainer>

            <TotalsSection>
                <TotalRow>
                    <TotalLabel>Costo Totale (Lordo):</TotalLabel>
                    <TotalValue>{formatCurrency(totals?.rawCost || 0)}</TotalValue>
                </TotalRow>
                <TotalRow>
                    <TotalLabel>Calo Peso Medio:</TotalLabel>
                    <TotalValue>{(totals?.weightLoss || 0).toFixed(2)}%</TotalValue>
                </TotalRow>
                <TotalRow>
                    <TotalLabel>Costo Totale (Netto):</TotalLabel>
                    <TotalValue>{formatCurrency(totals?.finalCost || 0)}</TotalValue>
                </TotalRow>
            </TotalsSection>
        </>
    );
};

export default IngredientList;
