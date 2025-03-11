import styled, { css } from 'styled-components';

// Container principale
export const CottureContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Statistiche delle cotture
export const CottureStats = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Badge per le statistiche
export const Badge = styled.span<{ variant: string }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  
  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: white;
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
        `;
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: white;
        `;
      case 'info':
        return css`
          background-color: ${theme.colors.info || '#17a2b8'};
          color: white;
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning};
          color: white;
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.danger};
          color: white;
        `;
      default:
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
        `;
    }
  }}
`;

// Controlli di visualizzazione
export const CottureControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// Gruppo di pulsanti
export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// Pulsante filtro
export const FilterButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) => 
    active ? 'white' : theme.colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.border};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
  }
`;

// Pulsante visualizzazione
export const ViewButton = styled(FilterButton)`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

// Layout griglia per la visualizzazione a card
export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

// Alert informativo
export const Alert = styled.div<{ variant: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: center;
  
  ${({ theme, variant }) => {
    switch (variant) {
      case 'info':
        return css`
          background-color: ${theme.colors.info || '#cff4fc'}20;
          color: ${theme.colors.info || '#055160'};
          border: 1px solid ${theme.colors.info || '#b6effb'};
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.warning}50;
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.danger}50;
        `;
      default:
        return css`
          background-color: ${theme.colors.background};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

// Tabella per visualizzazione a lista
export const CottureTable = styled.table`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
  }
  
  th {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    text-align: left;
  }
  
  tbody tr {
    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }
    
    &.in-corso {
      background-color: ${({ theme }) => theme.colors.primary}10;
    }
    
    &.completata {
      background-color: ${({ theme }) => theme.colors.success}10;
    }
  }
`;

// Componenti per l'accordio nella vista raggruppata
export const AccordionContainer = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const AccordionItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const AccordionHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
`;

export const AccordionButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background}80;
  }
  
  span {
    flex-grow: 1;
  }
`;

export const AccordionIcon = styled.div<{ isOpen: boolean }>`
  width: 12px;
  height: 12px;
  margin-left: ${({ theme }) => theme.spacing.sm};
  position: relative;
  
  &:before,
  &:after {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.colors.text.primary};
    transition: transform 0.25s ease-out;
  }
  
  &:before {
    top: 0;
    left: 5px;
    width: 2px;
    height: 12px;
    transform: ${({ isOpen }) => isOpen ? 'rotate(90deg)' : 'none'};
  }
  
  &:after {
    top: 5px;
    left: 0;
    width: 12px;
    height: 2px;
  }
`;

export const AccordionPanel = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  padding: 0;
  background-color: white;
`;

// Area di contenuto
export const ContentArea = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

// Utilità
export const ClearFix = styled.div`
  clear: both;
`;
