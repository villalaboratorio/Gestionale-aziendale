import styled, { keyframes } from 'styled-components';
import { StatoAbbattimento } from '../../../../types/models.types';

// Animazione per l'icona di rotazione
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h3`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

// Card base per le diverse sezioni
export const Card = styled.div<{ $stato?: StatoAbbattimento }>`
  background: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid 
    ${props => {
      switch (props.$stato) {
        case StatoAbbattimento.IN_CORSO:
          return props.theme.colors.primary;
        case StatoAbbattimento.COMPLETATO:
          return props.theme.colors.success;
        default:
          return props.theme.colors.border;
      }
    }};
`;

export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h4`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Icona rotante
export const SpinningIcon = styled.i`
  display: inline-block;
  animation: ${spin} 2s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

// Stato dell'abbattimento
export const StatusBadge = styled.div<{ $stato?: StatoAbbattimento }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  
  background: ${props => {
    switch (props.$stato) {
      case StatoAbbattimento.IN_CORSO:
        return props.theme.colors.primary + '20'; // 20% opacity
      case StatoAbbattimento.COMPLETATO:
        return props.theme.colors.success + '20'; // 20% opacity
      default:
        return props.theme.colors.border + '50'; // 50% opacity
    }
  }};
  
  color: ${props => {
    switch (props.$stato) {
      case StatoAbbattimento.IN_CORSO:
        return props.theme.colors.primary;
      case StatoAbbattimento.COMPLETATO:
        return props.theme.colors.success;
      default:
        return props.theme.colors.text.secondary;
    }
  }};
  
  i {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

// Form elements
export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

// Button styles usando il theme system
export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: none;
  
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'success': return props.theme.colors.success;
      case 'danger': return props.theme.colors.danger;
      default: return props.theme.colors.primary;
    }
  }};
  
  color: ${props => {
    switch (props.$variant) {
      case 'secondary': return props.theme.colors.text.primary;
      default: return 'white';
    }
  }};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  i {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

// Timer componenti
export const TimerContainer = styled.div`
  font-family: monospace;
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  display: inline-block;
  min-width: 200px;
`;

// Valutazione abbattimento
export const ValutazioneContainer = styled.div<{ $valutazione?: 'ottimale' | 'veloce' | 'lento' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: flex-start;
  
  background-color: ${props => {
    switch (props.$valutazione) {
      case 'ottimale': return props.theme.colors.success + '20';
      case 'veloce': return props.theme.colors.primary + '20';
      case 'lento': return props.theme.colors.warning + '20';
      default: return props.theme.colors.background;
    }
  }};
  
  border-left: 4px solid ${props => {
    switch (props.$valutazione) {
      case 'ottimale': return props.theme.colors.success;
      case 'veloce': return props.theme.colors.primary;
      case 'lento': return props.theme.colors.warning;
      default: return props.theme.colors.border;
    }
  }};
`;

export const IconContainer = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ValutazioneContent = styled.div`
  flex: 1;
`;

export const ValutazioneTitle = styled.h5`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const ValutazioneDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const SuggerimentiContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Nuovi stili per migliorare la visualizzazione delle temperature

export const TemperatureReadingsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const TemperatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export const TemperatureTimestamp = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const TemperatureReadingForm = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const TemperatureInput = styled(Input)`
  flex: 1;
`;

export const TemperatureTable = styled.div`
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: ${({ theme }) => theme.spacing.sm};
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      text-align: left;
    }
    
    th {
      background-color: ${({ theme }) => theme.colors.background};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover td {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`;

export const TextHighlight = styled.span<{ $type?: 'success' | 'warning' | 'danger' }>`
  color: ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'danger': return props.theme.colors.danger;
      default: return 'inherit';
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  margin: ${({ theme }) => theme.spacing.sm} 0;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => `${props.$progress}%`};
  background-color: ${props => {
    if (props.$progress < 30) return props.theme.colors.danger;
    if (props.$progress < 70) return props.theme.colors.warning;
    return props.theme.colors.success;
  }};
  border-radius: 4px;
  transition: width 0.5s;
`;

export const TimeEstimateContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.warning}20;
  border-left: 3px solid ${({ theme }) => theme.colors.warning};
  border-radius: 4px;
  
  p {
    margin: ${({ theme }) => theme.spacing.xs} 0;
  }
`;

export const NotificationsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Notification = styled.div<{ $type?: 'info' | 'success' | 'warning' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  
  background-color: ${props => {
    switch (props.$type) {
      case 'info': return props.theme.colors.primary + '20';
      case 'success': return props.theme.colors.success + '20';
      case 'warning': return props.theme.colors.warning + '20';
      case 'danger': return props.theme.colors.danger + '20';
      default: return props.theme.colors.primary + '20';
    }
  }};
  
  border-left: 3px solid ${props => {
    switch (props.$type) {
      case 'info': return props.theme.colors.primary;
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'danger': return props.theme.colors.danger;
      default: return props.theme.colors.primary;
    }
  }};
  
  i {
    margin-right: ${({ theme }) => theme.spacing.sm};
    font-size: 1.2rem;
  }
`;

export const NotificationContent = styled.div`
  flex: 1;
`;
