import styled from 'styled-components';

export const ChartContainer = styled.div`
  height: 350px;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  /* Stili responsivi */
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
    padding: ${({ theme }) => theme.spacing.sm};
  }
  
  /* Migliora l'aspetto del grafico stesso */
  .recharts-wrapper {
    margin: 0 auto;
  }
  
  /* Migliora la leggibilità del testo nei grafici */
  .recharts-text {
    fill: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  /* Migliora l'aspetto delle linee di griglia */
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: ${({ theme }) => theme.colors.border};
    stroke-dasharray: 3 3;
    stroke-opacity: 0.6;
  }
  
  /* Migliora l'aspetto dei tooltip */
  .recharts-tooltip-wrapper {
    .recharts-default-tooltip {
      background-color: ${({ theme }) => theme.colors.surface} !important;
      border: 1px solid ${({ theme }) => theme.colors.border} !important;
      border-radius: 4px;
      padding: ${({ theme }) => theme.spacing.sm} !important;
      box-shadow: ${({ theme }) => theme.shadows.medium};
      
      .recharts-tooltip-label {
        color: ${({ theme }) => theme.colors.text.primary};
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
        margin-bottom: ${({ theme }) => theme.spacing.xs};
      }
      
      .recharts-tooltip-item-list {
        margin: 0;
        padding: 0;
      }
      
      .recharts-tooltip-item {
        color: ${({ theme }) => theme.colors.text.secondary} !important;
        
        .recharts-tooltip-item-name {
          font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
        }
        
        .recharts-tooltip-item-value {
          font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
        }
      }
    }
  }
`;

export const EmptyStateMessage = styled.div`
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-style: italic;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  text-align: center;
  
  /* Aggiunge un'icona per migliorare l'aspetto visivo */
  &::before {
    content: '📊';
    font-size: 2rem;
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const ChartTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

export const ChartControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const LegendColor = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: ${({ theme }) => theme.spacing.xs};
  background-color: ${props => props.$color};
`;

export const ChartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
