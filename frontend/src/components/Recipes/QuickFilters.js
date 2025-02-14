import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  background: white;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary}1a;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveFilter = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;




const QuickFilters = ({ filters, onFilterChange, onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetchCategories();
  }, []);

  const fetchCategories = async () => {
      try {
          setLoading(true);
          console.log('Fetching categories...');
          const response = await axios.get('/api/category-recipes');
          console.log('Categories response:', response.data);
          setCategories(response.data);
          setError(null);
      } catch (err) {
          console.error('Errore nel recupero delle categorie:', err);
          setError('Errore nel caricamento delle categorie');
      } finally {
          setLoading(false);
      }
  };

  const clearFilters = () => {
      onFilterChange({
          categoria: '',
          complessita: '',
          tipo: '',
          stagionalita: ''
      });
      onSearch('');
  };

  const removeFilter = (filterKey) => {
      onFilterChange({ [filterKey]: '' });
  };

  const getActiveFilters = () => {
      return Object.entries(filters).filter(([_, value]) => value !== '');
  };

  const getFilterLabel = (key, value) => {
      switch (key) {
          case 'categoria':
              const category = categories.find(cat => cat._id === value);
              return category ? category.nome : value;
          case 'complessita':
              return value.charAt(0).toUpperCase() + value.slice(1);
          case 'tipo':
              return value.charAt(0).toUpperCase() + value.slice(1);
          case 'stagionalita':
              return value.charAt(0).toUpperCase() + value.slice(1);
          default:
              return value;
      }
  };

  return (
      <FiltersContainer>
          <FiltersHeader>
              <Title>
                  <FaFilter /> Filtri
              </Title>
              {getActiveFilters().length > 0 && (
                  <ClearButton onClick={clearFilters}>
                      <FaTimes /> Cancella filtri
                  </ClearButton>
              )}
          </FiltersHeader>

          <SearchBar>
              <SearchWrapper>
                  <SearchIcon />
                  <SearchInput
                      type="text"
                      placeholder="Cerca ricette..."
                      value={filters.search || ''}
                      onChange={(e) => onSearch(e.target.value)}
                  />
              </SearchWrapper>
          </SearchBar>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FiltersGrid>
              <FilterGroup>
                  <FilterLabel>Categoria</FilterLabel>
                  <Select
                      value={filters.categoria || ''}
                      onChange={(e) => onFilterChange({ categoria: e.target.value })}
                      disabled={loading}
                  >
                      <option value="">Tutte le categorie</option>
                      {categories.map(category => (
                          <option key={category._id} value={category._id}>
                              {category.name}
                          </option>
                      ))}
                  </Select>
              </FilterGroup>

              <FilterGroup>
                  <FilterLabel>Difficoltà</FilterLabel>
                  <Select
                      value={filters.complessita || ''}
                      onChange={(e) => onFilterChange({ complessita: e.target.value })}
                  >
                      <option value="">Tutte le difficoltà</option>
                      <option value="facile">Facile</option>
                      <option value="media">Media</option>
                      <option value="difficile">Difficile</option>
                  </Select>
              </FilterGroup>

              <FilterGroup>
                  <FilterLabel>Tipo</FilterLabel>
                  <Select
                      value={filters.tipo || ''}
                      onChange={(e) => onFilterChange({ tipo: e.target.value })}
                  >
                      <option value="">Tutti i tipi</option>
                      <option value="vegetariano">Vegetariano</option>
                      <option value="vegano">Vegano</option>
                      <option value="pesce">Pesce</option>
                      <option value="carne">Carne</option>
                  </Select>
              </FilterGroup>

              <FilterGroup>
                  <FilterLabel>Stagionalità</FilterLabel>
                  <Select
                      value={filters.stagionalita || ''}
                      onChange={(e) => onFilterChange({ stagionalita: e.target.value })}
                  >
                      <option value="">Tutte le stagioni</option>
                      <option value="primavera">Primavera</option>
                      <option value="estate">Estate</option>
                      <option value="autunno">Autunno</option>
                      <option value="inverno">Inverno</option>
                  </Select>
              </FilterGroup>
          </FiltersGrid>

          {getActiveFilters().length > 0 && (
              <ActiveFilters>
                  {getActiveFilters().map(([key, value]) => (
                      <FilterTag key={key}>
                          {getFilterLabel(key, value)}
                          <RemoveFilter onClick={() => removeFilter(key)}>
                              <FaTimes />
                          </RemoveFilter>
                      </FilterTag>
                  ))}
              </ActiveFilters>
          )}
      </FiltersContainer>
  );
};

export default QuickFilters;
