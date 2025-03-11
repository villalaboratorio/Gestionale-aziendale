import styled, { keyframes, css } from 'styled-components';

const pulsate = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const criticalPulsate = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(220, 53, 69, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(220, 53, 69, 0.6); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(220, 53, 69, 0.4); }
`;

export const Container = styled.div<{ size: string; pulsate?: boolean; critical?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'small' ? '80px' : props.size === 'large' ? '150px' : '100px'};
  height: ${props => props.size === 'small' ? '80px' : props.size === 'large' ? '150px' : '100px'};
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.surface} 0%, ${({ theme }) => theme.colors.background} 100%);
  box-shadow: ${({ theme, critical }) => 
    critical 
      ? `0 0 10px ${theme.colors.danger}` 
      : theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md};
  
  ${props => props.pulsate && css`
    animation: ${props.critical ? criticalPulsate : pulsate} 2s ease-in-out infinite;
  `}
  
  transition: all 0.3s ease;
`;

export const Temperature = styled.div<{ temp: number; min?: number; max?: number }>`
  font-size: ${props => {
    const size = props.temp < 0 ? 'smaller' : props.temp > 99 ? 'smaller' : 'normal';
    return size === 'smaller' ? '1.4rem' : '1.8rem';
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${props => {
    const temp = props.temp;
    const min = props.min || 0;
    const max = props.max || 100;
    
    // Calcola un colore in base alla temperatura
    if (temp <= min + (max-min)*0.3) return props.theme.colors.primary; // Blu per temperature basse
    if (temp <= min + (max-min)*0.6) return props.theme.colors.success; // Verde per temperature medie
    if (temp <= min + (max-min)*0.8) return props.theme.colors.warning; // Arancione per temperature medio-alte
    return props.theme.colors.danger; // Rosso per temperature alte
  }};
`;

export const Unit = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  width: 100%;
`;
