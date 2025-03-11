import React from 'react';
import styled from 'styled-components';

interface InteractiveCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const StyledCard = styled.div<{ isSelected?: boolean }>`
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  box-shadow: ${({ theme, isSelected }) => 
    isSelected ? theme.shadows.sm : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  ${({ isSelected, theme }) => isSelected && `
    background: ${theme.colors.primary + '08'};
    
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 20px 20px 0;
      border-color: transparent ${theme.colors.primary} transparent transparent;
    }
  `}
`;

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  isSelected = false,
  onClick,
  children,
  className
}) => {
  return (
    <StyledCard 
      isSelected={isSelected} 
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

export default InteractiveCard;
