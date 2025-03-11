import React from 'react';
import {
  TrackerContainer,
  StepContainer,
  StepNumber,
  StepLabel
} from './WorkflowTracker.styles';

interface Step {
  id: string;
  label: string;
}

interface WorkflowTrackerProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
}

const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  steps,
  currentStep,
  completedSteps
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }
  
  return (
    <TrackerContainer>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.includes(step.id);
        
        return (
          <StepContainer 
            key={step.id} 
            $isActive={isActive} 
            $isCompleted={isCompleted}
          >
            <StepNumber $isActive={isActive} $isCompleted={isCompleted}>
              {isCompleted ? '' : index + 1}
            </StepNumber>
            <StepLabel $isActive={isActive}>
              {step.label}
            </StepLabel>
          </StepContainer>
        );
      })}
    </TrackerContainer>
  );
};

export default WorkflowTracker;
