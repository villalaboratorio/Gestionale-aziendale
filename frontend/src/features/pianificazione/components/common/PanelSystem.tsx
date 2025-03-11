import React from 'react';
import styled from 'styled-components';
import Panel from './Panel';

// Componenti per organizzare i pannelli
const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

const PanelRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

// Esportare un componente contenitore
interface PanelSystemProps {
  children: React.ReactNode;
  variant?: 'grid' | 'row';
}

const PanelSystemContainer: React.FC<PanelSystemProps> = ({ 
  children, 
  variant = 'row' 
}) => {
  const Container = variant === 'grid' ? PanelGrid : PanelRow;
  
  return <Container>{children}</Container>;
};

// Esportare anche i singoli componenti
export { Panel, PanelGrid, PanelRow };
export default PanelSystemContainer;
