import React from 'react';
import styled from 'styled-components';
import { FaBook, FaLayerGroup, FaLeaf, FaClock } from 'react-icons/fa';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}1a;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatsBar = ({ stats }) => {
  return (
    <StatsContainer>
      <StatCard>
        <IconWrapper>
          <FaBook />
        </IconWrapper>
        <StatInfo>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Ricette Totali</StatLabel>
        </StatInfo>
      </StatCard>

      <StatCard>
        <IconWrapper>
          <FaLayerGroup />
        </IconWrapper>
        <StatInfo>
          <StatValue>{stats.categories}</StatValue>
          <StatLabel>Categorie</StatLabel>
        </StatInfo>
      </StatCard>

      <StatCard>
        <IconWrapper>
          <FaLeaf />
        </IconWrapper>
        <StatInfo>
          <StatValue>{stats.ingredients}</StatValue>
          <StatLabel>Ingredienti Totali</StatLabel>
        </StatInfo>
      </StatCard>

      <StatCard>
        <IconWrapper>
          <FaClock />
        </IconWrapper>
        <StatInfo>
          <StatValue>{stats.recent}</StatValue>
          <StatLabel>Ricette Recenti</StatLabel>
        </StatInfo>
      </StatCard>
    </StatsContainer>
  );
};

export default StatsBar;
