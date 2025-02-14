import React, { useState } from 'react';
import { 
    Container, Row, Col, Card, Nav, Table, 
    Form, Button, Modal, Badge, Pagination,
    ProgressBar, Breadcrumb, Dropdown, Alert
} from 'react-bootstrap';
import { 
    FaSearch, FaPlus, FaEdit, FaTrash, 
    FaFilter, FaSort, FaDownload, FaPrint 
} from 'react-icons/fa';

const StyleGuide = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <Container fluid className="style-guide p-4">
            <h1 className="mb-5">Gestionale Style Guide</h1>

            {/* Colors & Typography */}
            <section className="mb-5">
                <h2 className="section-title">Brand & Typography</h2>
                <Row className="g-4">
                    {/* Color System */}
                    <Col md={6}>
                        <Card>
                            <Card.Header>
                                <h3>Color System</h3>
                            </Card.Header>
                            <Card.Body>
                                <div className="color-grid">
                                    <div className="color-box primary">Primary - #2563eb</div>
                                    <div className="color-box secondary">Secondary - #64748b</div>
                                    <div className="color-box success">Success - #16a34a</div>
                                    <div className="color-box warning">Warning - #eab308</div>
                                    <div className="color-box danger">Danger - #dc2626</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Typography */}
                    <Col md={6}>
                        <Card>
                            <Card.Header>
                                <h3>Typography</h3>
                            </Card.Header>
                            <Card.Body>
                                <h1>Heading 1 - 24px</h1>
                                <h2>Heading 2 - 20px</h2>
                                <h3>Heading 3 - 18px</h3>
                                <p className="text-lg">Large Text - 16px</p>
                                <p>Regular Text - 14px</p>
                                <p className="text-sm">Small Text - 12px</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* Navigation Elements */}
            <section className="mb-5">
                <h2 className="section-title">Navigation</h2>
                <Row className="g-4">
                    {/* Breadcrumbs */}
                    <Col md={6}>
                        <Card>
                            <Card.Header>
                                <h3>Breadcrumbs</h3>
                            </Card.Header>
                            <Card.Body>
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                                    <Breadcrumb.Item href="#">Ricette</Breadcrumb.Item>
                                    <Breadcrumb.Item active>Dettaglio Ricetta</Breadcrumb.Item>
                                </Breadcrumb>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Tabs */}
                    <Col md={6}>
                        <Card>
                            <Card.Header>
                                <h3>Tabs Navigation</h3>
                            </Card.Header>
                            <Card.Body>
                                <Nav variant="tabs">
                                    <Nav.Item>
                                        <Nav.Link active>Dettagli</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link>Ingredienti</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link>Costi</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* Data Display */}
            <section className="mb-5">
                <h2 className="section-title">Data Display</h2>
                
                {/* Table */}
                <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h3>Tables</h3>
                        <div className="table-actions">
                            <Dropdown className="me-2">
                                <Dropdown.Toggle variant="outline-secondary">
                                    Actions
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>
                                        <FaDownload className="me-2" /> Export
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <FaPrint className="me-2" /> Print
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button variant="outline-primary" className="me-2">
                                <FaFilter /> Filter
                            </Button>
                            <Button variant="primary">
                                <FaPlus /> Add New
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>ID <FaSort /></th>
                                    <th>Nome <FaSort /></th>
                                    <th>Categoria</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#001</td>
                                    <td>Ricetta Example</td>
                                    <td>Dolci</td>
                                    <td><Badge bg="success">Active</Badge></td>
                                    <td>
                                        <Button variant="link" size="sm"><FaEdit /></Button>
                                        <Button variant="link" size="sm"><FaTrash /></Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="text-muted">
                                Showing 1 to 10 of 50 entries
                            </div>
                            <Pagination>
                                <Pagination.Prev />
                                <Pagination.Item active>{1}</Pagination.Item>
                                <Pagination.Item>{2}</Pagination.Item>
                                <Pagination.Item>{3}</Pagination.Item>
                                <Pagination.Next />
                            </Pagination>
                        </div>
                    </Card.Body>
                </Card>

                {/* Cards */}
                <Card className="mb-4">
                    <Card.Header>
                        <h3>Cards</h3>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-4">
                            <Col md={4}>
                                <Card className="dashboard-card">
                                    <Card.Body>
                                        <h4>Ricette Totali</h4>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h2>256</h2>
                                            <ProgressBar now={75} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </section>

            {/* Form Elements */}
            <section className="mb-5">
                <h2 className="section-title">Form Elements</h2>
                <Card>
                    <Card.Header>
                        <h3>Input Elements</h3>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Text Input</Form.Label>
                                    <Form.Control type="text" placeholder="Enter text" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select</Form.Label>
                                    <Form.Select>
                                        <option>Select option</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Date Picker</Form.Label>
                                    <Form.Control type="date" />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Search Input</Form.Label>
                                    <div className="search-input">
                                        <FaSearch />
                                        <Form.Control type="search" placeholder="Search..." />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>File Upload</Form.Label>
                                    <Form.Control type="file" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Textarea</Form.Label>
                                    <Form.Control as="textarea" rows={3} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </section>

            {/* Interactive Components */}
            <section className="mb-5">
                <h2 className="section-title">Interactive Components</h2>
                
                {/* Buttons */}
                <Card className="mb-4">
                    <Card.Header>
                        <h3>Buttons</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex gap-2 mb-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="success">Success</Button>
                            <Button variant="danger">Danger</Button>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary">Outline</Button>
                            <Button variant="primary" size="sm">Small</Button>
                            <Button variant="primary" disabled>Disabled</Button>
                        </div>
                    </Card.Body>
                </Card>

                {/* Modals */}
                <Card className="mb-4">
                    <Card.Header>
                        <h3>Modals</h3>
                    </Card.Header>
                    <Card.Body>
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Open Modal
                        </Button>

                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Modal Title</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Modal content goes here...
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </Button>
                                <Button variant="primary">Save Changes</Button>
                            </Modal.Footer>
                        </Modal>
                    </Card.Body>
                </Card>

                {/* Alerts */}
                <Card className="mb-4">
                    <Card.Header>
                        <h3>Alerts</h3>
                    </Card.Header>
                    <Card.Body>
                        <Alert variant="success" className="mb-2">
                            Success Alert - Operation completed successfully!
                        </Alert>
                        <Alert variant="danger" className="mb-2">
                            Error Alert - Something went wrong!
                        </Alert>
                        <Alert variant="warning" className="mb-2">
                            Warning Alert - Please review the changes
                        </Alert>
                        <Alert variant="info">
                            Info Alert - New updates available
                        </Alert>
                    </Card.Body>
                </Card>
            </section>
        </Container>
    );
};

export default StyleGuide;
