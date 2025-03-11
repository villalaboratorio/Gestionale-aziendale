import styled, { keyframes } from 'styled-components';

export const LavorazioniContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const PassaggiContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const ProgressContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ProgressBar = styled.div`
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => `${$percentage}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  transition: width 0.3s ease;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EventTimeline = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  border-left: 2px solid ${({ theme }) => theme.colors.border};
  padding-left: ${({ theme }) => theme.spacing.md};
`;

// Definiamo l'animazione usando keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const EventItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  animation: ${fadeIn} 0.3s ease-out forwards;
  
  &:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    left: -24px;
    top: 4px;
  }
`;

export const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const EventTimestamp = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EventDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const NoteContent = styled.div`
  white-space: pre-line;
  font-size: 0.9rem;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.light};
  border-radius: 4px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// Stili aggiuntivi per migliorare la UI

export const ActionButton = styled.button`
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

export const StatusBadge = styled.span<{ $status: 'pending' | 'inProgress' | 'completed' }>`
  display: inline-block;
  padding: 0.25em 0.5em;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: 0.25rem;
  text-transform: uppercase;
  
  background-color: ${({ $status, theme }) => 
    $status === 'completed' ? theme.colors.success.light :
    $status === 'inProgress' ? theme.colors.primary.light :
    theme.colors.warning.light};
    
  color: ${({ $status, theme }) => 
    $status === 'completed' ? theme.colors.success.dark :
    $status === 'inProgress' ? theme.colors.primary.dark :
    theme.colors.warning.dark};
`;

export const SectionTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ClearFix = styled.div`
  clear: both;
`;

export const AlertWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.info.light};
  color: ${({ theme }) => theme.colors.info.dark};
  border-left: 4px solid ${({ theme }) => theme.colors.info.main};
`;
