import styled from 'styled-components';

export const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  
  h3 {
    margin: 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 1.25rem;
  }
`;

export const TableActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const RefreshButton = styled.button`
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

export const CardBody = styled.div`
  padding: 0;
`;

export const TableResponsive = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const TableHead = styled.thead`
  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #475569;
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
`;

export const TableBody = styled.tbody`
  tr:hover {
    background-color: #f8fafc;
  }
  
  td {
    padding: 12px 16px;
    vertical-align: middle;
    border-bottom: 1px solid #e2e8f0;
  }
`;

export const Badge = styled.span<{ variant?: 'success' | 'primary' | 'warning' | 'danger' | 'secondary' }>`
  padding: 5px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.75rem;
  color: white;
  background-color: ${props => {
    switch (props.variant) {
      case 'success': return '#10b981';
      case 'primary': return '#2563eb';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#64748b';
    }
  }};
`;

export const DetailButton = styled.button`
  color: #2563eb;
  border-color: #2563eb;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  border: 1px solid #2563eb;
  
  &:hover {
    background-color: #2563eb;
    color: white;
  }
  
  i {
    margin-right: 4px;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #64748b;
`;

export const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: #64748b;
  background-color: #f8fafc;
  border-radius: 6px;
  margin: 16px;
`;
