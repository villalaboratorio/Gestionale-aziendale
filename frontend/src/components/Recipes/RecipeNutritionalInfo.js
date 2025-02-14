import React, { useState, useEffect } from 'react';
import NutritionalCalculator from '../NutritionalCalculator';
import '../../styles/Recipes/RecipeNutritionalInfo.css';

const RecipeNutritionalInfo = ({ recipe }) => {
    const [totalWeight, setTotalWeight] = useState(0);

    useEffect(() => {
        if (recipe?.ingredienti) {
            const weight = recipe.ingredienti.reduce((acc, ing) => {
                return acc + (parseFloat(ing.quantita) || 0);
            }, 0);
            setTotalWeight(weight);
        }
    }, [recipe]);

    if (!recipe) return <div>Nessuna ricetta selezionata</div>;

    return (
        <div className="recipe-nutritional-info">
            <div className="nutritional-header">
                <h3>Valori Nutrizionali</h3>
                <div className="serving-info">
                    <span>Porzioni: {recipe.porzioni}</span>
                    <span>Peso Totale: {totalWeight}g</span>
                </div>
            </div>

            <div className="nutritional-content">
                <NutritionalCalculator 
                    recipe={recipe} 
                    totalWeight={totalWeight}
                />
            </div>
        </div>
    );
};

export default RecipeNutritionalInfo;
