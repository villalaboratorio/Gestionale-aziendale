import styled from 'styled-components';

export const LavorazioniContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
`;

export const LavorazioniHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

export const FilterControls = styled.div`
  display: flex;
  gap: 10px;

  select {
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #f8f9fa;
    font-size: 0.9rem;
  }
`;

export const LavorazioniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

export const LavorazioneCard = styled.div<{ urgenza: 'normal' | 'high' | 'urgent' }>`
  border: 1px solid #ddd;
  border-left: 5px solid ${({ urgenza }) => 
    urgenza === 'urgent' ? '#dc3545' : 
    urgenza === 'high' ? '#ffc107' : 
    '#0d6efd'};
  border-radius: 6px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const StatusBadge = styled.span<{ stato: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background-color: ${({ stato }) => 
    stato === 'in_corso' ? '#0d6efd' : 
    stato === 'completata' ? '#198754' : 
    stato === 'in_attesa' ? '#6c757d' : 
    stato === 'annullata' ? '#dc3545' : 
    '#6c757d'};
  color: white;
`;

export const CardHeader = styled.div`
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h3 {
      margin: 0;
      font-size: 1.1rem;
    }
  }

  .scheda-number {
    font-size: 0.85rem;
    color: #6c757d;
  }
`;

export const CardBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .cliente-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    
    i {
      color: #0d6efd;
    }
  }
`;

export const ProcessInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .proceso-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    
    i {
      color: #6c757d;
    }
  }
`;

export const TimeInfo = styled.div`
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  
  .time-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    i {
      color: #6c757d;
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6c757d;
  
  i {
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.1rem;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  
  p {
    margin-top: 16px;
    color: #6c757d;
  }
`;
