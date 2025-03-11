import styled, { css } from 'styled-components';

export const TimelineContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
`;

export const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

export const DateNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    padding: 8px 12px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e9ecef;
    }

    &.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
  }

  .current-period {
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 4px;
    font-weight: 500;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
`;

export const FilterChip = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
  background: ${props => props.active ? '#007bff' : '#fff'};
  color: ${props => props.active ? '#fff' : '#495057'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.active ? '#0069d9' : '#e9ecef'};
  }

  i {
    font-size: 0.8rem;
  }
`;

export const EventsCounter = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: ${props => props.theme.colors?.primary || '#007bff'};
  color: white;
  font-size: 0.75rem;
  margin-left: 5px;
`;

export const TimelineContent = styled.div`
  position: relative;
`;

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TimelineDay = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;

  .day-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    
    .day-name {
      font-weight: 600;
      margin-right: 10px;
    }
    
    .day-date {
      color: #6c757d;
    }
    
    .today-badge {
      background: #28a745;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-left: 10px;
    }
    
    .event-count {
      margin-left: auto;
      color: #6c757d;
      font-size: 0.9rem;
    }
  }
`;

export const TimelineSummary = styled.div`
  padding: 16px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
`;

export const ExpandCollapseButton = styled.button<{ isExpanded?: boolean }>`
  width: 100%;
  padding: 8px;
  background: #f8f9fa;
  border: none;
  border-top: ${props => props.isExpanded ? 'none' : '1px solid #dee2e6'};
  border-bottom: ${props => props.isExpanded ? '1px solid #dee2e6' : 'none'};
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  
  &:hover {
    background: #e9ecef;
  }
`;

export const TimelineItem = styled.div<{ status: string; eventType: string }>`
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f5;
  position: relative;
  
  /* Barra colorata a sinistra in base al tipo di evento */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    
    ${({ eventType }) => {
      switch(eventType) {
        case 'lavorazione':
          return css`background-color: #007bff;`;
        case 'consegna':
          return css`background-color: #28a745;`;
        case 'ricevimento':
          return css`background-color: #fd7e14;`;
        default:
          return css`background-color: #6c757d;`;
      }
    }}
  }

  /* Colore di sfondo in base allo stato */
  ${({ status }) => {
    switch(status) {
      case 'urgent':
        return css`background-color: #fff3f3;`;
      case 'in-progress':
        return css`background-color: #f0f7ff;`;
      case 'completed':
        return css`background-color: #f0fff4;`;
      default:
        return css`background-color: #fff;`;
    }
  }}

  &:last-child {
    border-bottom: none;
  }
`;

export const TimeItemContent = styled.div`
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    
    h4 {
      margin: 0;
      font-size: 1.1rem;
      color: #212529;
    }
    
    .item-time {
      font-size: 0.9rem;
      color: #6c757d;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  
  .item-description {
    margin-bottom: 12px;
    color: #495057;
    font-size: 0.95rem;
  }
  
  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .item-client {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #6c757d;
    }
    
    .item-actions {
      a {
        font-size: 0.9rem;
        color: #007bff;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 5px;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6c757d;
  text-align: center;
  
  i {
    margin-bottom: 16px;
    color: #adb5bd;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  
  p {
    margin-top: 16px;
    color: #6c757d;
  }
`;
