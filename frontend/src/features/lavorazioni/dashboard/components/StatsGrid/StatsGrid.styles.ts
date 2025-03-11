import styled from 'styled-components';

// Aggiorna l'interfaccia StatCardProps per includere la proprietà $clickable
interface StatCardProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  $clickable?: boolean;
}

export const StatCard = styled.div<StatCardProps>`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return '#3b82f6';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return 'white';
    }
  }};
  color: ${props => props.variant ? 'white' : '#1e293b'};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  ${props => props.$clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    &:active {
      transform: translateY(-1px);
    }
  `}
`;

// Altri styled components rimangono invariati
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

export const StatContent = styled.div``;

export const StatTitle = styled.h4`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 6px;
`;

export const StatValue = styled.h2`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
`;

export const StatIcon = styled.div`
  font-size: 24px;
  opacity: 0.8;
`;
