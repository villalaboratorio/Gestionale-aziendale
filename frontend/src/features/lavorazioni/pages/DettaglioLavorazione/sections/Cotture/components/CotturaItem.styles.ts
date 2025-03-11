import styled from 'styled-components';
import { StatoCottura } from '../../../../../types/models.types';

// Prefissa tutte le props custom con $
export const TableRow = styled.tr<{ $stato: StatoCottura }>`
  background-color: ${({ $stato, theme }) => 
    $stato === StatoCottura.IN_CORSO ? theme.colors.primary + '20' : 
    $stato === StatoCottura.COMPLETATA ? theme.colors.success + '20' : 'transparent'};
`;

export const TableCell = styled.td`
  vertical-align: middle;
  padding: ${({ theme }) => theme.spacing.xs};
`;

export const CardContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Card = styled.div<{ $stato: StatoCottura }>`
  border: 1px solid ${({ $stato, theme }) => 
    $stato === StatoCottura.IN_CORSO ? theme.colors.primary : 
    $stato === StatoCottura.COMPLETATA ? theme.colors.success : theme.colors.border};
  border-radius: 0.25rem;
  height: 100%;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h5`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const CardText = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const StatoBadge = styled.span<{ $stato: StatoCottura }>`
  display: inline-block;
  padding: 0.25em 0.75em;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: 1rem;
  color: white;
  background-color: ${({ $stato, theme }) => 
    $stato === StatoCottura.NON_INIZIATA ? theme.colors.secondary : 
    $stato === StatoCottura.IN_CORSO ? theme.colors.primary : 
    theme.colors.success};
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ActionButton = styled.button<{ variant?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  
  background-color: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.primary : 
    variant === 'success' ? theme.colors.success :
    variant === 'warning' ? theme.colors.warning :
    variant === 'danger' ? theme.colors.danger :
    'transparent'};
    
  color: ${({ variant }) => 
    variant === 'primary' || variant === 'success' || variant === 'danger' ? 'white' : 
    variant === 'warning' ? '#212529' : 
    '#6c757d'};
    
  border-color: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.primary : 
    variant === 'success' ? theme.colors.success :
    variant === 'warning' ? theme.colors.warning :
    variant === 'danger' ? theme.colors.danger :
    '#6c757d'};
    
  &:hover {
    opacity: 0.85;
  }
  
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
