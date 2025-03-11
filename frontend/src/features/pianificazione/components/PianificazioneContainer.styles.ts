import styled from 'styled-components';

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 1400px;
  margin: 0 auto;

  h2 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const WorkflowSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Stili per il WorkflowTracker
export const WorkflowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

export const StepIndicator = styled.div<{ active: boolean; completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme, active, completed }) => 
    completed ? theme.colors.success : 
    active ? theme.colors.primary : 
    theme.colors.background.light};
  border: 2px solid ${({ theme, active, completed }) => 
    completed ? theme.colors.success : 
    active ? theme.colors.primary : 
    theme.colors.border};
  color: ${({ active, completed }) => 
    (active || completed) ? 'white' : 'inherit'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const StepLabel = styled.div<{ active: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme, active }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${({ active }) => active ? 600 : 400};
  text-align: center;
`;

export const StepConnector = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${({ theme, completed }) => 
    completed ? theme.colors.success : theme.colors.border};
  margin: 0 ${({ theme }) => theme.spacing.xs};
  position: relative;
  top: -16px;
  z-index: 0;
`;
