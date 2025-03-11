import styled from 'styled-components';

type TimerStatus = 'inactive' | 'completed' | 'critical' | 'warning' | 'normal';

const getStatusColor = (status: TimerStatus, theme: any) => {
  switch (status) {
    case 'inactive': return theme.colors.secondary;
    case 'completed': return theme.colors.success;
    case 'critical': return theme.colors.danger;
    case 'warning': return theme.colors.warning;
    case 'normal': return theme.colors.primary;
    default: return theme.colors.secondary;
  }
};

export const TimerContainer = styled.div<{ $status: TimerStatus }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TimerProgress = styled.div`
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
`;

export const TimerBar = styled.div<{ $status: TimerStatus }>`
  height: 100%;
  background-color: ${({ $status, theme }) => getStatusColor($status, theme)};
  transition: width 0.3s ease;
`;

export const TimerCountdown = styled.span<{ $status: TimerStatus }>`
  font-family: monospace;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $status, theme }) => getStatusColor($status, theme)};
`;

export const CotturaBadge = styled.span<{ $status: TimerStatus }>`
  display: inline-block;
  padding: 0.25em 0.75em;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: 1rem;
  color: white;
  background-color: ${({ $status, theme }) => getStatusColor($status, theme)};
`;
