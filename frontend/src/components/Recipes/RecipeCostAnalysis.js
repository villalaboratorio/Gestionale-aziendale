import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Table, Form } from 'react-bootstrap';
import { costService } from '../../services/costService';

const RecipeCostAnalysis = ({ recipe }) => {
    const [marginPercentage, setMarginPercentage] = useState(30);
    const [costsData, setCostsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCostsData = useCallback(async () => {
        if (!recipe?._id) return;
        
        try {
            setLoading(true);
            const data = await costService.getRecipeCosts(recipe._id);
            setCostsData(data);
        } catch (err) {
            console.error('Errore nel caricamento dei costi:', err);
        } finally {
            setLoading(false);
        }
    }, [recipe]);

    useEffect(() => {
        loadCostsData();
    }, [loadCostsData]);

    if (loading) {
        return <div>Caricamento costi in corso...</div>;
    }

    return (
        <div className="recipe-cost-analysis">
            <Card className="mb-4">
                <Card.Header>
                    <h3>Riepilogo Costi</h3>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <div className="cost-item">
                                <label>Costo Totale</label>
                                <h4>{costsData?.total?.costoTotale}</h4>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="cost-item">
                                <label>Costo per Porzione</label>
                                <h4>{costsData?.total?.costoPerPorzione}</h4>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="cost-item">
                                <label>Margine (%)</label>
                                <Form.Control
                                    type="number"
                                    value={marginPercentage}
                                    onChange={(e) => setMarginPercentage(Number(e.target.value))}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="cost-item">
                                <label>Prezzo Suggerito</label>
                                <h4>{costsData?.total?.costoPerPorzione && marginPercentage ? 
                                    (parseFloat(costsData.total.costoPerPorzione.replace('€', '').trim()) / (1 - marginPercentage/100)).toFixed(2) + ' €' 
                                    : '0,00 €'}</h4>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>
                    <h3>Dettaglio Costi Ingredienti</h3>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Ingrediente</th>
                                <th>Quantità</th>
                                <th>Unità</th>
                                <th>Costo Unitario</th>
                                <th>Costo Totale</th>
                            </tr>
                        </thead>
                        <tbody>
                            {costsData?.ingredients?.map((ing, index) => (
                                <tr key={index}>
                                    <td>{ing.nome}</td>
                                    <td>{ing.quantita}</td>
                                    <td>{ing.unitaMisura}</td>
                                    <td>{ing.costoUnitario}</td>
                                    <td>{ing.costoTotale}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RecipeCostAnalysis;
