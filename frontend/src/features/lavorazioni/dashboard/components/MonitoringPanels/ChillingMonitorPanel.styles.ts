import styled from 'styled-components';

export const MonitorCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const MonitorHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  
  i {
    margin-right: 8px;
    color: #0ea5e9; // Colore blu per abbattimento
  }
  
  h4 {
    margin: 0;
    font-weight: 600;
  }
`;

export const ChillingList = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
`;

export const ChillingItemCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SchemaLabel = styled.div`
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 4px;
`;

export const RecipeName = styled.h5`
  margin-bottom: 8px;
`;

export const TemperatureDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
`;

export const TemperatureValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

export const ProgressContainer = styled.div`
  margin: 12px 0;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.875rem;
  color: #475569;
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => Math.min(100, Math.max(0, props.progress))}%;
  background: #0ea5e9;
  border-radius: 4px;
`;

export const TimeRemaining = styled.div`
  font-size: 0.875rem;
  color: #475569;
  margin: 8px 0;
`;

export const ViewButton = styled.button`
  margin-top: 8px;
  color: #2563eb;
  background: transparent;
  border: 1px solid #2563eb;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
    color: white;
  }
`;
// Aggiungi queste definizioni di componenti al file di stili esistente
export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;

  > div {
    margin-bottom: 1rem;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  button {
    margin-top: 0.5rem;
  }
`;

export const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  
  i {
    font-size: 2rem;
    margin-bottom: 12px;
    opacity: 0.4;
  }
`;
