import styled from 'styled-components';

export const StatsPanelContainer = styled.div`
  margin-bottom: 24px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

export const StatCard = styled.div<{ variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' }>`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    
    background-color: ${({ variant }) => 
      variant === 'primary' ? '#e9f2ff' : 
      variant === 'success' ? '#e6f7ef' :
      variant === 'warning' ? '#fff8e6' :
      variant === 'danger' ? '#ffebee' :
      '#e8f5fd'};
    
    color: ${({ variant }) => 
      variant === 'primary' ? '#0d6efd' : 
      variant === 'success' ? '#198754' :
      variant === 'warning' ? '#ffc107' :
      variant === 'danger' ? '#dc3545' :
      '#0dcaf0'};
    
    i {
      font-size: 24px;
    }
  }

  .stat-title {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 8px;
  }

  .stat-description {
    font-size: 0.875rem;
    color: ${({ variant }) => 
      variant === 'primary' ? '#0d6efd' : 
      variant === 'success' ? '#198754' :
      variant === 'warning' ? '#ffc107' :
      variant === 'danger' ? '#dc3545' :
      '#0dcaf0'};
    display: flex;
    align-items: center;
    gap: 5px;

    i {
      font-size: 14px;
    }
  }
`;

export const LoadingState = styled.div`
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
