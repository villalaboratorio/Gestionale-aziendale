import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import StatsBar from '../components/Recipes/StatsBar';
import QuickFilters from '../components/Recipes/QuickFilters';
import RecipeCard from '../components/Recipes/RecipeCard';
import RecipeTable from '../components/Recipes/RecipeTable';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const NewRecipeButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}e6;
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ViewButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'white'};
  color: ${({ $active }) => $active ? 'white' : 'inherit'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.background};
  }
`;

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const RecipesPage = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [stats, setStats] = useState({
        total: 0,
        categories: 0,
        ingredients: 0,
        recent: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        categoria: '',
        complessita: '',
        tipo: ''
    });

    const fetchRecipes = useCallback(async () => {
        try {
            const queryParams = {
                search: filters.search,
                categoria: filters.categoria,
                complessita: filters.complessita,
                tipo: filters.tipo
            };
            
            Object.keys(queryParams).forEach(key => 
                !queryParams[key] && delete queryParams[key]
            );

            const response = await axios.get('/api/ricette', { 
                params: queryParams 
            });
            
            // Estrai l'array ricette dalla risposta
            const { ricette } = response.data;
            setRecipes(ricette || []);
            updateStats(ricette || []);
        } catch (error) {
            console.error('Errore nel recupero delle ricette:', error);
        }
    }, [filters]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const updateStats = (data) => {
        setStats({
            total: data.length,
            categories: new Set(data.map(r => r.categoria?._id)).size,
            ingredients: data.reduce((acc, r) => acc + (r.ingredienti?.length || 0), 0),
            recent: data.filter(r => {
                const createdAt = new Date(r.createdAt);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return createdAt >= thirtyDaysAgo;
            }).length
        });
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    };

    const handleCardClick = (recipeId) => {
        navigate(`/ricette/${recipeId}`);
    };

    const handleNewRecipe = () => {
        navigate('/ricette/new');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa ricetta?')) {
            try {
                await axios.delete(`/api/ricette/${id}`);
                fetchRecipes();
            } catch (error) {
                console.error('Errore durante l\'eliminazione:', error);
            }
        }
    };

    return (
        <PageContainer>
            <Header>
                <Title>Gestione Ricette</Title>
                <NewRecipeButton onClick={handleNewRecipe}>
                    <FaPlus /> Nuova Ricetta
                </NewRecipeButton>
            </Header>

            <StatsBar stats={stats} />

            <QuickFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />

            <ViewControls>
                <ViewButton
                    $active={viewMode === 'grid'}
                    onClick={() => setViewMode('grid')}
                >
                    Griglia
                </ViewButton>
                <ViewButton
                    $active={viewMode === 'table'}
                    onClick={() => setViewMode('table')}
                >
                    Tabella
                </ViewButton>
            </ViewControls>

            {viewMode === 'grid' ? (
                <RecipesGrid>
                    {recipes?.map(recipe => (
                        <RecipeCard
                            key={recipe._id}
                            recipe={recipe}
                            onClick={() => handleCardClick(recipe._id)}
                            onDelete={() => handleDelete(recipe._id)}
                        />
                    ))}
                </RecipesGrid>
            ) : (
                <RecipeTable
                    recipes={recipes}
                    onRecipeClick={handleCardClick}
                    onDelete={handleDelete}
                />
            )}
        </PageContainer>
    );
};

export default RecipesPage;
