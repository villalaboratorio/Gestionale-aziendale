import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import UnitModal from '../modal/UnitModal';
import { UNIT_TYPES } from '../components/Recipes/RecipeGeneralInfo/utils/conversions';

const UnitsPage = () => {
    const [units, setUnits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            const res = await axios.get('/api/units');
            setUnits(res.data);
        } catch (error) {
            console.error('Errore nel recupero delle unità:', error);
        }
    };

    const handleEdit = (unit) => {
        setSelectedUnit(unit);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa unità?')) {
            try {
                await axios.delete(`/api/units/${id}`);
                fetchUnits();
            } catch (error) {
                console.error('Errore nell\'eliminazione:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUnit(null);
    };

    const filteredUnits = units.filter(unit => {
        const matchesType = filterType ? unit.type === filterType : true;
        const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            unit.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestione Unità di Misura</h2>
                <Button onClick={() => setShowModal(true)}>
                    Nuova Unità
                </Button>
            </div>

            <div className="d-flex gap-3 mb-4">
                <Form.Control
                    type="text"
                    placeholder="Cerca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-auto"
                />
                <Form.Select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-auto"
                >
                    <option value="">Tutti i tipi</option>
                    {Object.keys(UNIT_TYPES).map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Form.Select>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Abbreviazione</th>
                        <th>Tipo</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUnits.map(unit => (
                        <tr key={unit._id}>
                            <td>{unit.name}</td>
                            <td>{unit.abbreviation}</td>
                            <td>{unit.type}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEdit(unit)}
                                    >
                                        Modifica
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(unit._id)}
                                    >
                                        Elimina
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <UnitModal 
                show={showModal}
                handleClose={handleCloseModal}
                fetchUnits={fetchUnits}
                unit={selectedUnit}
            />
        </Container>
    );
};

export default UnitsPage;
