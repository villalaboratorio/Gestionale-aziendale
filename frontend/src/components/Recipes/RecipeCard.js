import React from 'react';
import styled from 'styled-components';
import { FaTrash, FaEdit, FaUtensils, FaClock, FaThermometerHalf } from 'react-icons/fa';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardImage = styled.div`
  height: 80px;
  background: ${props => props.imageUrl ? `url(${props.imageUrl})` : '#f0f0f0'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const CardMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Badge = styled.span`
  background: ${({ $type, theme }) => {
    switch ($type) {
      case 'facile':
        return theme.colors.success;
      case 'medio':
        return theme.colors.warning;
      case 'difficile':
        return theme.colors.danger;
      default:
        return theme.colors.primary;
    }
  }};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $variant, theme }) => 
    $variant === 'danger' ? theme.colors.danger : 'transparent'};
  color: ${({ $variant, theme }) => 
    $variant === 'danger' ? 'white' : theme.colors.text.secondary};

  &:hover {
    background: ${({ $variant, theme }) => 
      $variant === 'danger' ? theme.colors.danger + 'dd' : theme.colors.background};
  }
`;

const RecipeCard = ({ recipe, onClick, onDelete }) => {
    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <Card onClick={onClick}>
            <CardImage imageUrl={recipe.immagine} />
            <CardContent>
                <CardTitle>{recipe.nome}</CardTitle>
                <CardMeta>
                    <MetaItem>
                        <FaUtensils />
                        Categoria: {recipe.categoria?.name}
                    </MetaItem>
                    <MetaItem>
                        <FaClock />
                        Tempo: {recipe.tempoPreparazione + (recipe.tempoCottura || 0)} min
                    </MetaItem>
                    {recipe.temperatura && (
                        <MetaItem>
                            <FaThermometerHalf />
                            Temperatura: {recipe.temperatura}°C
                        </MetaItem>
                    )}
                    <MetaItem>
                        <Badge $type={recipe.difficolta?.toLowerCase()}>
                            {recipe.difficolta}
                        </Badge>
                    </MetaItem>
                </CardMeta>
            </CardContent>
            <CardActions>
                <ActionButton onClick={(e) => e.stopPropagation()}>
                    <FaEdit />
                </ActionButton>
                <ActionButton $variant="danger" onClick={handleDelete}>
                    <FaTrash />
                </ActionButton>
            </CardActions>
        </Card>
    );
};

export default RecipeCard;
