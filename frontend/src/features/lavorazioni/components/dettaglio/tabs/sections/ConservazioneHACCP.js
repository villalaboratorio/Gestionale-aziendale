import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSave, FaThermometerHalf, FaClock, FaWarehouse } from 'react-icons/fa';
import styled from 'styled-components';

const StyledCard = styled(Card)`
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
`;

const StyledHeader = styled(Card.Header)`
    background: #f8f9fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
`;

const Section = styled(Card)`
    margin-bottom: 1rem;
    border: 1px solid #e9ecef;
    
    .card-header {
        background: #f8f9fa;
        font-weight: 500;
        padding: 0.75rem 1rem;
    }
`;

const CheckboxGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
`;

const StyledCheckbox = styled(Form.Check)`
    .form-check-input:checked {
        background-color: #0d6efd;
        border-color: #0d6efd;
    }
`;

const ParameterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    .form-control {
        max-width: 150px;
    }
    
    .icon {
        color: #6c757d;
    }
`;

const ConservazioneHACCP = ({ dettaglioId, onUpdate }) => {
    const [conservazione, setConservazione] = useState({
        imballaggio: {
            plastica: false,
            carta: false,
            acciaio: false,
            vetro: false,
            alluminio: false,
            sottovuoto: false
        },
        metodo: {
            acqua: false,
            liquidoGoverno: false,
            agro: false,
            olio: false
        },
        temperatura: '',
        inizio: null,
        fine: null,
        cella: ''
    });
    
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/dettaglio-lavorazioni/${dettaglioId}`);
                if (!response.ok) throw new Error('Errore nel caricamento dei dati');
                const data = await response.json();
                if (data.conservazione) {
                    setConservazione(data.conservazione);
                }
            } catch (error) {
                setError('Errore nel caricamento dei dati');
            }
        };

        if (dettaglioId) {
            fetchData();
        }
    }, [dettaglioId]);

    const handleCheckboxChange = (category, field) => {
        setConservazione(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: !prev[category][field]
            }
        }));
        setSuccess(false);
    };

    const handleInputChange = (field, value) => {
        setConservazione(prev => ({
            ...prev,
            [field]: value
        }));
        setSuccess(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await onUpdate(conservazione);
            setSuccess(true);
        } catch (error) {
            setError('Errore durante il salvataggio');
        } finally {
            setSaving(false);
        }
    };

    return (
        <StyledCard>
            <StyledHeader>
                <h5 className="mb-0">Conservazione HACCP</h5>
                <Button 
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <FaSave className="me-2" />
                    {saving ? 'Salvataggio...' : 'Salva'}
                </Button>
            </StyledHeader>

            <Card.Body>
                {error && (
                    <div className="alert alert-danger mb-3">{error}</div>
                )}
                {success && (
                    <div className="alert alert-success mb-3">
                        Dati salvati con successo
                    </div>
                )}

                <Row>
                    <Col md={6}>
                        <Section>
                            <Card.Header>Tipo Imballaggio</Card.Header>
                            <CheckboxGroup>
                                {Object.entries(conservazione.imballaggio).map(([key, value]) => (
                                    <StyledCheckbox
                                        key={key}
                                        id={`imballaggio-${key}`}
                                        type="checkbox"
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        checked={value}
                                        onChange={() => handleCheckboxChange('imballaggio', key)}
                                    />
                                ))}
                            </CheckboxGroup>
                        </Section>
                    </Col>

                    <Col md={6}>
                        <Section>
                            <Card.Header>Metodo di Conservazione</Card.Header>
                            <CheckboxGroup>
                                {Object.entries(conservazione.metodo).map(([key, value]) => (
                                    <StyledCheckbox
                                        key={key}
                                        id={`metodo-${key}`}
                                        type="checkbox"
                                        label={key.split(/(?=[A-Z])/).join(' ')}
                                        checked={value}
                                        onChange={() => handleCheckboxChange('metodo', key)}
                                    />
                                ))}
                            </CheckboxGroup>
                        </Section>
                    </Col>
                </Row>

                <Section>
                    <Card.Header>Parametri di Conservazione</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <ParameterGroup>
                                    <FaThermometerHalf className="icon" />
                                    <Form.Group>
                                        <Form.Label>Temperatura (°C)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={conservazione.temperatura}
                                            onChange={(e) => handleInputChange('temperatura', e.target.value)}
                                        />
                                    </Form.Group>
                                </ParameterGroup>
                            </Col>
                            <Col md={6}>
                                <ParameterGroup>
                                    <FaWarehouse className="icon" />
                                    <Form.Group>
                                        <Form.Label>Cella</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={conservazione.cella}
                                            onChange={(e) => handleInputChange('cella', e.target.value)}
                                        />
                                    </Form.Group>
                                </ParameterGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <ParameterGroup>
                                    <FaClock className="icon" />
                                    <Form.Group>
                                        <Form.Label>Inizio</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={conservazione.inizio || ''}
                                            onChange={(e) => handleInputChange('inizio', e.target.value)}
                                        />
                                    </Form.Group>
                                </ParameterGroup>
                            </Col>
                            <Col md={6}>
                                <ParameterGroup>
                                    <FaClock className="icon" />
                                    <Form.Group>
                                        <Form.Label>Fine</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={conservazione.fine || ''}
                                            onChange={(e) => handleInputChange('fine', e.target.value)}
                                        />
                                    </Form.Group>
                                </ParameterGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Section>
            </Card.Body>
        </StyledCard>
    );
};

export default ConservazioneHACCP;
