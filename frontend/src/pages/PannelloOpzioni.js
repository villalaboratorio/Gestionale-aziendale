import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCogs, FaBoxOpen, FaBalanceScale, FaThList, FaUtensils, FaClipboardList } from 'react-icons/fa';

const PannelloOpzioni = () => {
    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Pannello Opzioni</h1>
            <Row>
                <Col md={4} className="mb-4">
                    <Link to="/category-goods">
                        <Card className="text-center">
                            <Card.Body>
                                <FaBoxOpen size={48} className="mb-2" />
                                <Card.Title>Categorie Merci</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/processing-states">
                        <Card className="text-center">
                            <Card.Body>
                                <FaCogs size={48} className="mb-2" />
                                <Card.Title>Stati delle Lavorazioni</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/category-recipes">
                        <Card className="text-center">
                            <Card.Body>
                                <FaClipboardList size={48} className="mb-2" />
                                <Card.Title>Categorie Ricette</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md={4} className="mb-4">
                    <Link to="/processing-types">
                        <Card className="text-center">
                            <Card.Body>
                                <FaThList size={48} className="mb-2" />
                                <Card.Title>Tipi di Lavorazione</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/clienti">
                        <Card className="text-center">
                            <Card.Body>
                                <FaThList size={48} className="mb-2" />
                                <Card.Title>Clienti</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/units">
                        <Card className="text-center">
                            <Card.Body>
                                <FaBalanceScale size={48} className="mb-2" />
                                <Card.Title>Unità di Misura</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md={4} className="mb-4">
                    <Link to="/quantity-types">
                        <Card className="text-center">
                            <Card.Body>
                                <FaThList size={48} className="mb-2" />
                                <Card.Title>Operatori</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/ingredients">
                        <Card className="text-center">
                            <Card.Body>
                                <FaUtensils size={48} className="mb-2" />
                                <Card.Title>Gestione Ingredienti</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/fasi-types">
                        <Card className="text-center">
                            <Card.Body>
                                <FaThList size={48} className="mb-2" />
                                <Card.Title>Tipi di Fasi</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md={4} className="mb-4">
                    <Link to="/fasi-methods">
                        <Card className="text-center">
                            <Card.Body>
                                <FaThList size={48} className="mb-2" />
                                <Card.Title>Metodi di Fasi</Card.Title>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
    <Link to="/tipo-cotture">
        <Card className="text-center">
            <Card.Body>
                <FaThList size={48} className="mb-2" />
                <Card.Title>Tipi Cottura</Card.Title>
            </Card.Body>
        </Card>
    </Link>
</Col>
            </Row>
        </Container>
    );
};

export default PannelloOpzioni;
