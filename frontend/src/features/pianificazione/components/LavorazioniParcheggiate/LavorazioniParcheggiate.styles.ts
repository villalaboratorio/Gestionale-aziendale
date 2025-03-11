import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ActionBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

interface ActionButtonProps {
  primary?: boolean;
}

export const ActionButton = styled.button<ActionButtonProps>`
  padding: 8px 16px;
  background: ${({ theme, primary }) => primary ? theme.colors.primary : theme.colors.background.paper};
  color: ${({ theme, primary }) => primary ? theme.colors.text.inverse : theme.colors.text.primary};
  border: 1px solid ${({ theme, primary }) => primary ? theme.colors.primary : theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme, primary }) => primary ? theme.colors.primaryDark || '#1a56db' : theme.colors.background.hover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FiltersBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const FilterSelect = styled.select`
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  
  input[type="radio"] {
    cursor: pointer;
  }
`;

export const LavorazioniLista = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-height: 400px;
  overflow-y: auto;
`;

export const LavorazioneItem = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const LavorazioneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const RicettaNome = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ClienteTag = styled.span`
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
  background: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const LavorazioneDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.85rem;
`;

export const DetailItem = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const FooterArea = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

export const TotaliInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TotaleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const TotaleValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;
