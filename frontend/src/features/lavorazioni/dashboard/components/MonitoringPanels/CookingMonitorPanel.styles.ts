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
    color: #f97316;
  }
  
  h4 {
    margin: 0;
    font-weight: 600;
  }
`;

export const CookingList = styled.div`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
`;

export const CookingItemCard = styled.div`
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

export const CookingItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  p {
    margin: 0;
    &:first-child {
      font-weight: 500;
    }
  }
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

export const LoadingState = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  
  p {
    margin-top: 12px;
  }
`;

export const ErrorMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #ef4444;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  
  i {
    font-size: 2rem;
    margin-bottom: 12px;
    color: #ef4444;
  }
  
  button {
    margin-top: 12px;
  }
`;
