import React from 'react';
import styled from 'styled-components';
import useCotturaTimer from '../hooks/useCotturaTimer';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

const TimerDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 6px;
`;

const Label = styled.span`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const Value = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  color: ${({ theme, isWarning }) => isWarning ? theme.colors.warning : theme.colors.text.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ status, theme }) => {
    switch(status) {
      case 'in_corso': return theme.colors.primary;
      case 'completata': return theme.colors.success;
      default: return theme.colors.secondary;
    }
  }};
  transition: width 0.3s ease;
`;

const CotturaTimer = ({ cottura }) => {
  const { tempoTrascorso, tempoRimanente, percentualeCompletamento } = useCotturaTimer(cottura);

  if (!cottura.inizio) return null;

  return (
    <TimerContainer>
      <TimerDisplay>
        <TimerSection>
          <Label>Tempo Trascorso</Label>
          <Value>{tempoTrascorso}</Value>
        </TimerSection>
        
        <TimerSection>
          <Label>Tempo Rimanente</Label>
          <Value isWarning={tempoRimanente < 0}>{tempoRimanente}</Value>
        </TimerSection>
      </TimerDisplay>

      <ProgressBar>
        <Progress 
          progress={percentualeCompletamento} 
          status={cottura.stato}
        />
      </ProgressBar>
    </TimerContainer>
  );
};

export default React.memo(CotturaTimer);
