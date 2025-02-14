import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Card, Input } from '../components/common';
import IngredientModal from '../modal/IngredientModal';

const PageContainer = styled.div`
    padding: 1.5rem;
    background: #f8fafc;
`;

const TableContainer = styled(Card)`
    overflow-x: auto;
    margin-top: 1rem;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    th, td {
        padding: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
`;

const SearchBar = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const IngredientsPage = () => {
    const [ingredients, setIngredients] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [units, setUnits] = useState([]);

    const fetchIngredients = useCallback(async () => {
        try {
            const response = await axios.get('/api/ingredienti', {
                params: {
                    page,
                    search: searchTerm,
                    limit: 20
                }
            });
            setIngredients(response.data.ingredients || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Errore nel caricamento ingredienti:', error);
        }
    }, [page, searchTerm]);

    const fetchUnits = useCallback(async () => {
        try {
            const response = await axios.get('/api/units');
            setUnits(response.data || []);
        } catch (error) {
            console.error('Errore nel caricamento unità:', error);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
        fetchUnits();
    }, [fetchIngredients, fetchUnits]);

    const handleEdit = (ingredient) => {
        setSelectedIngredient(ingredient);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo ingrediente?')) {
            try {
                await axios.delete(`/api/ingredienti/${id}`);
                fetchIngredients();
            } catch (error) {
                console.error('Errore nella cancellazione:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedIngredient(null);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <PageContainer>
            <h2>Gestione Ingredienti</h2>
            
            <SearchBar>
                <Input 
                    placeholder="Cerca ingrediente..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <Button onClick={() => setShowModal(true)}>
                    Nuovo Ingrediente
                </Button>
            </SearchBar>

            <TableContainer>
                <StyledTable>
                    <thead>
                        <tr>
                            <th>Codice</th>
                            <th>Nome</th>
                            <th>U.M.</th>
                            <th>Costo</th>
                            <th>Kcal</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients && ingredients.length > 0 ? (
                            ingredients.map(ingredient => (
                                <tr key={ingredient._id}>
                                    <td>{ingredient.code}</td>
                                    <td>{ingredient.name}</td>
                                    <td>{ingredient.unit?.name}</td>
                                    <td>{Number(ingredient.cost).toFixed(2)} €</td>
                                    <td>{ingredient.nutrition?.kcal}</td>
                                    <td>
                                        <ActionButtons>
                                            <Button 
                                                variant="secondary"
                                                onClick={() => handleEdit(ingredient)}
                                            >
                                                Modifica
                                            </Button>
                                            <Button 
                                                variant="danger"
                                                onClick={() => handleDelete(ingredient._id)}
                                            >
                                                Elimina
                                            </Button>
                                        </ActionButtons>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    Nessun ingrediente trovato
                                </td>
                            </tr>
                        )}
                    </tbody>
                </StyledTable>
            </TableContainer>

            <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                    <Button
                        key={index + 1}
                        variant={page === index + 1 ? "primary" : "secondary"}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
            </Pagination>

            <IngredientModal 
                show={showModal}
                handleClose={handleCloseModal}
                fetchIngredients={fetchIngredients}
                availableUnits={units}
                ingredient={selectedIngredient}
            />
        </PageContainer>
    );
};

export default IngredientsPage;
