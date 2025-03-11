import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ItemCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const SearchContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary}40;
    }
  }
`;

export const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const MateriePrimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const MateriaPrimaCard = styled.div<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $isSelected }) => $isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $isSelected }) => $isSelected ? `${theme.colors.primary}10` : theme.colors.background.paper};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transform: translateY(-2px);
  }
  
  h4 {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  p {
    margin: ${({ theme }) => theme.spacing.xs} 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`;

export const IndicatoreQuantita = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const QuantitaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span:last-child {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
