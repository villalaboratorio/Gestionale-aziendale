import styled from 'styled-components';

export const TrackerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

export const StepContainer = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, $isActive, $isCompleted }) => 
      $isActive || $isCompleted 
        ? theme.colors.primary 
        : theme.colors.border};
    top: 20px;
    left: -50%;
    z-index: 0;
  }
  
  &:first-child:before {
    display: none;
  }
`;

export const StepNumber = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme, $isActive, $isCompleted }) => 
    $isCompleted 
      ? theme.colors.success
      : $isActive 
        ? theme.colors.primary 
        : theme.colors.background.light};
  border: 2px solid ${({ theme, $isActive, $isCompleted }) => 
    $isCompleted 
      ? theme.colors.success
      : $isActive 
        ? theme.colors.primary 
        : theme.colors.border};
  color: ${({ theme, $isActive, $isCompleted }) => 
    $isCompleted || $isActive ? '#fff' : theme.colors.text.secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: relative;
  z-index: 1;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  ${({ $isCompleted }) => $isCompleted && `
    &:after {
      content: '✓';
      font-size: 1.2rem;
    }
  `}
`;

export const StepLabel = styled.span<{ $isActive: boolean }>`
  font-size: 0.9rem;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  text-align: center;
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
`;
