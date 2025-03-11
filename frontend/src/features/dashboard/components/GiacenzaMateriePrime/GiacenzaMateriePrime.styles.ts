import styled from 'styled-components';

export const MateriePrimeContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
`;

export const GiacenzaHeader = styled.div`
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

export const GiacenzaCard = styled.div<{ criticita: 'normal' | 'warning' | 'critical' }>`
  border: 1px solid #ddd;
  border-left: 5px solid ${({ criticita }) => 
    criticita === 'critical' ? '#dc3545' : 
    criticita === 'warning' ? '#ffc107' : 
    '#28a745'};
  border-radius: 6px;
  margin-bottom: 16px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    background-color: #f8f9fa;
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-lot {
      font-size: 0.7rem;
      background-color: #6c757d;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .doc-number {
      font-size: 0.85rem;
      color: #6c757d;
    }
  }
`;

export const GiacenzaBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .date-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    
    i {
      margin-right: 6px;
      color: #6c757d;
    }
  }

  .usage-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    background-color: #f8f9fa;
    padding: 8px 12px;
    border-radius: 4px;

    .quantity, .prelievi {
      display: flex;
      flex-direction: column;
    }
  }
`;

export const ClienteInfo = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  
  i {
    margin-right: 8px;
    color: #0d6efd;
  }
`;

export const TempoGiacenzaIndicator = styled.div<{ criticita: 'normal' | 'warning' | 'critical' }>`
  .progress {
    height: 10px;
    border-radius: 5px;
    background-color: #e9ecef;
    margin-bottom: 8px;
  }

  .bg-critical {
    background-color: #dc3545;
  }

  .bg-warning {
    background-color: #ffc107;
  }

  .bg-normal {
    background-color: #28a745;
  }

  .alert-message {
    font-size: 0.85rem;
    color: ${props => props.criticita === 'critical' ? '#dc3545' : '#ffc107'};
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
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
