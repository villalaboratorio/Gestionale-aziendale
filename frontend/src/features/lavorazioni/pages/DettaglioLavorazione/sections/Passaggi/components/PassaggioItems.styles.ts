import styled from 'styled-components';

interface PassaggioCardProps {
  $status: 'not-started' | 'in-progress' | 'completed';
}

export const PassaggioContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const PassaggioCard = styled.div<PassaggioCardProps>`
  flex: 1;
  min-width: 300px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  ${({ $status, theme }) => $status === 'in-progress' && `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
  `}
  
  ${({ $status, theme }) => $status === 'completed' && `
    border-color: ${theme.colors.success};
    background-color: rgba(22, 163, 74, 0.05);
  `}
`;

export const PassaggioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: #f8f9fa;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`;

export const PassaggioTitle = styled.h5`
  margin: 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export const StatusBadge = styled.span<PassaggioCardProps>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ $status, theme }) => $status === 'not-started' && `
    background-color: #e9ecef;
    color: ${theme.colors.secondary};
  `}
  
  ${({ $status, theme }) => $status === 'in-progress' && `
    background-color: #cce5ff;
    color: ${theme.colors.primary};
  `}
  
  ${({ $status, theme }) => $status === 'completed' && `
    background-color: #d4edda;
    color: ${theme.colors.success};
  `}
`;

export const PassaggioBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

export const PassaggioTimeline = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const TimelineItem = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const TimelineLabel = styled.span`
  width: 70px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TimelineValue = styled.span`
  flex: 1;
`;

export const PassaggioFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
`;

export const CompletedInfo = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;
