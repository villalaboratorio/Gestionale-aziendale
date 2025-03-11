import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const RicettaNome = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const DettaglioValue = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

export const InfoText = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TotaleValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const LavorazioniList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 400px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.sm};
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.light};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const LavorazioneCard = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    
    .ricetta-nome {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const DettagliGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const DettaglioItem = styled.div`
  display: flex;
  flex-direction: column;
  
  .dettaglio-label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 2px;
  }
  
  .dettaglio-value {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
  }
`;

export const InputGroup = styled.div`
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  label {
    min-width: 100px;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  input {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    flex: 1;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
    }
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  
  &:hover {
    transform: scale(1.2);
  }
`;

export const TotaliArea = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  .totali-info {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const TotaleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .totale-label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  .totale-value {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  background-color: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
`;
