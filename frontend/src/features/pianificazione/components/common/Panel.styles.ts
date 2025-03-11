import styled from 'styled-components';

export const PanelContainer = styled.div<{ $isExpanded: boolean }>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: ${({ $isExpanded }) => $isExpanded ? '2000px' : '50px'};
`;

export const PanelHeader = styled.div<{ $isExpanded: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${({ theme, $isExpanded }) => 
    $isExpanded ? theme.colors.background.light : theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme, $isExpanded }) => 
    $isExpanded ? theme.colors.border : 'transparent'};
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const PanelIcon = styled.span<{ $isExpanded: boolean }>`
  transition: transform 0.3s ease;
  transform: ${({ $isExpanded }) => $isExpanded ? 'rotate(180deg)' : 'rotate(0)'};
`;

export const PanelBody = styled.div<{ $isExpanded: boolean }>`
  padding: ${({ theme, $isExpanded }) => 
    $isExpanded ? theme.spacing.md : '0 ' + theme.spacing.md};
  opacity: ${({ $isExpanded }) => $isExpanded ? 1 : 0};
  transition: opacity 0.3s ease, padding 0.3s ease;
`;
