import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 24px;
  margin-left: 64px; /* Allineato con la slim-navbar */
  background-color: #f8f9fa;
  min-height: 100vh;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const HeaderTitle = styled.div`
  h1 {
    font-size: 1.8rem;
    margin: 0;
    color: #333;
  }
  
  p {
    margin: 4px 0 0;
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f1f3f5;
  }
  
  &.primary {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
    
    &:hover {
      background-color: #0b5ed7;
    }
  }
`;

export const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Manteniamo ContentSection ma viene esportato solo se effettivamente necessario
export const ContentSection = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
