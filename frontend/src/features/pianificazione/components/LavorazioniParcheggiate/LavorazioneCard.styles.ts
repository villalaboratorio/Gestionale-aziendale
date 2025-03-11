import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

export const InfoContent = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  background-color: ${({ theme, $variant }) => 
    $variant === 'edit' 
      ? theme.colors.info 
      : theme.colors.danger};
  
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;
