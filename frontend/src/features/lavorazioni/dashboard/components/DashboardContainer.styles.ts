import styled from 'styled-components';
import { Nav } from 'react-bootstrap';

export const DashboardWrapper = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8fafc;
  min-height: 100vh;
`;

export const DashboardHeader = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderContent = styled.div``;

export const Title = styled.h1`
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: #64748b;
  font-size: 16px;
  margin: 0;
`;

export const Button = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1d4ed8;
  }
  
  i {
    margin-right: 8px;
  }
`;

// Definisci l'interfaccia per le props di Card
interface CardProps {
  fullHeight?: boolean;
}

export const Card = styled.div<CardProps>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  height: ${props => props.fullHeight ? '100%' : 'auto'};
`;

export const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  
  h3 {
    margin: 0;
    font-weight: 600;
    color: #1e293b;
  }
`;

export const CardBody = styled.div`
  padding: 20px;
`;

// Componente styled per i tab di monitoraggio
export const MonitoringTabs = styled(Nav)`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
  
  .nav-item {
    flex: 1;
    display: flex;
    padding: 0 8px;
    
    &:first-child {
      padding-left: 0;
    }
    
    &:last-child {
      padding-right: 0;
    }
  }
  
  .nav-link {
    flex: 1;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0 16px;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f8fafc;
    }
    
    &.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    &.cooking.active {
      background: #16a34a;
      border-color: #16a34a;
    }
    
    &.chilling.active {
      background: #0ea5e9;
      border-color: #0ea5e9;
    }
    
    &.assembly.active {
      background: #eab308;
      border-color: #eab308;
    }
    
    i {
      font-size: 18px;
      margin-right: 8px;
    }
  }
`;
// Aggiungi questi componenti alla fine del file

interface FilterBadgeProps {
  $variant?: 'default' | 'clear';
}

export const FilterBadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FilterBadge = styled.div<FilterBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: ${props => props.$variant === 'clear' ? '#f1f5f9' : '#e0f2fe'};
  color: ${props => props.$variant === 'clear' ? '#64748b' : '#0369a1'};
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  i {
    font-size: 0.75rem;
  }
  
  &:hover {
    background-color: ${props => props.$variant === 'clear' ? '#e2e8f0' : '#bae6fd'};
  }
`;

// Contenitore per il contenuto dei pannelli
export const MonitoringContent = styled.div`
  margin-bottom: 24px;
`;
