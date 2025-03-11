import styled from 'styled-components';

export const Container = styled.div`
  margin: 0;
  padding: 0;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

export const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatusBadge = styled.span<{ variant?: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.variant) {
      case 'info':
        return '#e3f2fd';
      case 'success':
        return '#e8f5e9';
      case 'warning':
        return '#fff3e0';
      case 'danger':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'info':
        return '#0277bd';
      case 'success':
        return '#2e7d32';
      case 'warning':
        return '#ef6c00';
      case 'danger':
        return '#c62828';
      default:
        return '#424242';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'info':
        return '#bbdefb';
      case 'success':
        return '#c8e6c9';
      case 'warning':
        return '#ffe0b2';
      case 'danger':
        return '#ffcdd2';
      default:
        return '#e0e0e0';
    }
  }};
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
