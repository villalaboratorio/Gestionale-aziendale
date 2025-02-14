import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import { nutritionService } from '../services/nutritionService';

const NutritionalCalculator = ({ recipe }) => {
    const [nutritionalValues, setNutritionalValues] = useState({
        perServing: {
            kcal: 0,
            proteins: 0,
            carbohydrates: 0,
            fats: 0,
            saturatedFats: 0,
            sugars: 0,
            salt: 0
        },
        per100g: {
            kcal: 0,
            proteins: 0,
            carbohydrates: 0,
            fats: 0,
            saturatedFats: 0,
            sugars: 0,
            salt: 0
        }
    });

    const [totalWeight, setTotalWeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const calculateTotalWeight = useCallback(() => {
        if (!recipe?.ingredienti) return;
        
        const weight = recipe.ingredienti.reduce((acc, ing) => {
            return acc + (parseFloat(ing.quantita) || 0);
        }, 0);
        setTotalWeight(weight);
    }, [recipe]);

    const calculateNutritionalValues = useCallback(async () => {
        if (!recipe?.ingredienti) return;
        
        setLoading(true);
        setError(null);

        try {
            const values = {
                perServing: {
                    kcal: 0,
                    proteins: 0,
                    carbohydrates: 0,
                    fats: 0,
                    saturatedFats: 0,
                    sugars: 0,
                    salt: 0
                },
                per100g: {
                    kcal: 0,
                    proteins: 0,
                    carbohydrates: 0,
                    fats: 0,
                    saturatedFats: 0,
                    sugars: 0,
                    salt: 0
                }
            };

            for (const ing of recipe.ingredienti) {
                if (!ing.ingrediente?._id) continue;

                const nutritionData = await nutritionService.getNutritionById(ing.ingrediente._id);
                if (nutritionData) {
                    const quantity = parseFloat(ing.quantita) || 0;
                    const multiplier = quantity / 100;

                    Object.keys(values.perServing).forEach(nutrient => {
                        values.perServing[nutrient] += (nutritionData[nutrient] || 0) * multiplier;
                    });
                }
            }

            if (recipe.porzioni > 0) {
                Object.keys(values.perServing).forEach(nutrient => {
                    values.perServing[nutrient] = values.perServing[nutrient] / recipe.porzioni;
                });
            }

            if (totalWeight > 0) {
                Object.keys(values.per100g).forEach(nutrient => {
                    values.per100g[nutrient] = (values.perServing[nutrient] * recipe.porzioni / totalWeight) * 100;
                });
            }

            setNutritionalValues(values);
            setLoading(false);
        } catch (err) {
            setError('Errore nel calcolo dei valori nutrizionali');
            console.error('Errore nel calcolo:', err);
            setLoading(false);
        }
    }, [recipe, totalWeight]);

    useEffect(() => {
        calculateTotalWeight();
    }, [calculateTotalWeight]);

    useEffect(() => {
        calculateNutritionalValues();
    }, [calculateNutritionalValues]);

    if (loading) return <div>Calcolo valori nutrizionali in corso...</div>;
    if (error) return <div>Errore: {error}</div>;
    if (!recipe) return <div>Nessuna ricetta selezionata</div>;

    return (
        <Row>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <h4>Valori per Porzione</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered>
                            <tbody>
                                <tr>
                                    <td>Calorie</td>
                                    <td>{nutritionalValues.perServing.kcal.toFixed(1)} kcal</td>
                                </tr>
                                <tr>
                                    <td>Proteine</td>
                                    <td>{nutritionalValues.perServing.proteins.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>Carboidrati</td>
                                    <td>{nutritionalValues.perServing.carbohydrates.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>di cui Zuccheri</td>
                                    <td>{nutritionalValues.perServing.sugars.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>Grassi</td>
                                    <td>{nutritionalValues.perServing.fats.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>di cui Saturi</td>
                                    <td>{nutritionalValues.perServing.saturatedFats.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>Sale</td>
                                    <td>{nutritionalValues.perServing.salt.toFixed(1)} g</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <h4>Valori per 100g</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered>
                            <tbody>
                                <tr>
                                    <td>Calorie</td>
                                    <td>{nutritionalValues.per100g.kcal.toFixed(1)} kcal</td>
                                </tr>
                                <tr>
                                    <td>Proteine</td>
                                    <td>{nutritionalValues.per100g.proteins.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>Carboidrati</td>
                                    <td>{nutritionalValues.per100g.carbohydrates.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>di cui Zuccheri</td>
                                    <td>{nutritionalValues.per100g.sugars.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>Grassi</td>
                                    <td>{nutritionalValues.per100g.fats.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>di cui Saturi</td>
                                    <td>{nutritionalValues.per100g.saturatedFats.toFixed(1)} g</td>
                                </tr>
                                <tr>
                                    <td>Sale</td>
                                    <td>{nutritionalValues.per100g.salt.toFixed(1)} g</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default NutritionalCalculator;
