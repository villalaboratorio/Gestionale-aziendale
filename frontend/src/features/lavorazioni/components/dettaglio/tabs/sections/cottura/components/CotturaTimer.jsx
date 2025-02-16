import React from 'react';
import styled from 'styled-components';

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
  if (!cottura.inizio) return null;

  const now = new Date();
  const start = new Date(cottura.inizio);
  const end = new Date(cottura.finePrevista);
  
  const trascorso = now - start;
  const totale = end - start;
  const rimanente = end - now;
  
  const percentuale = Math.min(100, (trascorso / totale) * 100);
  
  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <TimerDisplay>
        <TimerSection>
          <Label>Tempo Trascorso</Label>
          <Value>{formatTime(trascorso)}</Value>
        </TimerSection>
        
        <TimerSection>
          <Label>Tempo Rimanente</Label>
          <Value isWarning={rimanente < 0}>{formatTime(Math.abs(rimanente))}</Value>
        </TimerSection>
      </TimerDisplay>

      <ProgressBar>
        <Progress 
          progress={percentuale} 
          status={cottura.stato}
        />
      </ProgressBar>
    </TimerContainer>
  );
};

export default React.memo(CotturaTimer);
