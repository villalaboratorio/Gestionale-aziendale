import React from 'react';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import { FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';

const RecipeReports = ({ recipe }) => {
    return (
        <div className="recipe-reports">
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h3 className="mb-0">Scheda Tecnica</h3>
                        </Card.Header>
                        <Card.Body>
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <th>Nome Ricetta</th>
                                        <td>{recipe?.nome}</td>
                                    </tr>
                                    <tr>
                                        <th>Codice</th>
                                        <td>{recipe?.numeroRicetta}</td>
                                    </tr>
                                    <tr>
                                        <th>Categoria</th>
                                        <td>{recipe?.categoria}</td>
                                    </tr>
                                    <tr>
                                        <th>Porzioni</th>
                                        <td>{recipe?.porzioni}</td>
                                    </tr>
                                    <tr>
                                        <th>Tempo Totale</th>
                                        <td>{recipe?.tempoPreparazione} min</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h3 className="mb-0">Valori Nutrizionali</h3>
                        </Card.Header>
                        <Card.Body>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Nutriente</th>
                                        <th>per 100g</th>
                                        <th>per porzione</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Calorie</td>
                                        <td>{recipe?.valoriNutrizionali?.calorie100g} kcal</td>
                                        <td>{recipe?.valoriNutrizionali?.caloriePerPorzione} kcal</td>
                                    </tr>
                                    <tr>
                                        <td>Proteine</td>
                                        <td>{recipe?.valoriNutrizionali?.proteine100g}g</td>
                                        <td>{recipe?.valoriNutrizionali?.proteinePerPorzione}g</td>
                                    </tr>
                                    <tr>
                                        <td>Carboidrati</td>
                                        <td>{recipe?.valoriNutrizionali?.carboidrati100g}g</td>
                                        <td>{recipe?.valoriNutrizionali?.carboidratiPerPorzione}g</td>
                                    </tr>
                                    <tr>
                                        <td>Grassi</td>
                                        <td>{recipe?.valoriNutrizionali?.grassi100g}g</td>
                                        <td>{recipe?.valoriNutrizionali?.grassiPerPorzione}g</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header>
                    <h3 className="mb-0">Esporta Report</h3>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex gap-3">
                        <Button $variant="primary">
                            <FaFilePdf /> Scheda Tecnica PDF
                        </Button>
                        <Button $variant="success">
                            <FaFileExcel /> Esporta Excel
                        </Button>
                        <Button $variant="secondary">
                            <FaPrint /> Stampa
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RecipeReports;
