import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};

  &:hover {
    background: ${({ sortable, theme }) => 
      sortable ? theme.colors.background : theme.colors.background};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Category = styled.span`
  background: ${({ theme }) => theme.colors.primary}1a;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ variant, theme }) => 
    variant === 'delete' ? theme.colors.danger : theme.colors.primary};
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SortIcon = styled(FaSort)`
  margin-left: ${({ theme }) => theme.spacing.xs};
  opacity: 0.5;
`;

const RecipeTable = ({ recipes, onRecipeClick, onDelete }) => {
  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th sortable>
              Nome <SortIcon />
            </Th>
            <Th sortable>
              Categoria <SortIcon />
            </Th>
            <Th sortable>
              Porzioni <SortIcon />
            </Th>
            <Th sortable>
              Tempo Totale <SortIcon />
            </Th>
            <Th>Azioni</Th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(recipe => (
            <Tr key={recipe._id} onClick={() => onRecipeClick(recipe._id)}>
              <Td>{recipe.nome}</Td>
              <Td>
                <Category>{recipe.categoria?.nome}</Category>
              </Td>
              <Td>{recipe.porzioni}</Td>
              <Td>{recipe.tempoTotale || 0} min</Td>
              <Td>
                <ActionsContainer>
                  <ActionButton onClick={(e) => {
                    e.stopPropagation();
                    onRecipeClick(recipe._id);
                  }}>
                    <FaEdit size={16} />
                  </ActionButton>
                  <ActionButton 
                    variant="delete" 
                    onClick={(e) => handleDelete(e, recipe._id)}
                  >
                    <FaTrash size={16} />
                  </ActionButton>
                </ActionsContainer>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default RecipeTable;
