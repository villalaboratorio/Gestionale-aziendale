import * as React from 'react';
import styled from 'styled-components';
import { LavorazioneEvent, EventType } from '../types/lavorazioni.types';

interface EventTimelineProps {
  events: LavorazioneEvent[];
}

// Styled components per la timeline
const TimelineContainer = styled.div`
  position: relative;
  padding-left: 30px;
  margin-bottom: 20px;
  
  &:before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #e0e0e0;
  }
`;

const TimelineEvent = styled.div<{ eventType: EventType }>`
  position: relative;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  &:before {
    content: '';
    position: absolute;
    left: -24px;
    top: 16px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => {
      switch (props.eventType) {
        case EventType.START:
          return '#0d6efd'; // primary
        case EventType.COMPLETE:
          return '#198754'; // success
        case EventType.CHANGE_OPERATOR:
          return '#6c757d'; // secondary
        case EventType.NOTE:
          return '#ffc107'; // warning
        default:
          return '#0dcaf0'; // info
      }
    }};
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const EventTitle = styled.h6`
  margin: 0;
  font-weight: 600;
`;

const EventTime = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const EventDescription = styled.p`
  margin: 0;
  color: #333;
`;

const EventNote = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: #f8f9fa;
  border-left: 3px solid #ffc107;
  font-size: 0.9rem;
  color: #495057;
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
`;

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  // Funzione per formattare l'orario
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Funzione per ottenere il titolo dell'evento
  const getEventTitle = (event: LavorazioneEvent): string => {
    switch (event.type) {
      case EventType.START:
        return 'Avvio fase';
      case EventType.COMPLETE:
        return 'Completamento fase';
      case EventType.CHANGE_OPERATOR:
        return 'Cambio operatore';
      case EventType.NOTE:
        return 'Nota aggiunta';
      default:
        return 'Evento';
    }
  };
  
  if (events.length === 0) {
    return (
      <NoEventsMessage>
        <i className="bi bi-calendar-x me-2"></i>
        Nessun evento registrato
      </NoEventsMessage>
    );
  }
  
  return (
    <TimelineContainer>
      {events.map((event, index) => (
        <TimelineEvent key={index} eventType={event.type}>
          <EventHeader>
            <EventTitle>
              <i className={`bi me-2 ${
                event.type === EventType.START ? 'bi-play-circle' :
                event.type === EventType.COMPLETE ? 'bi-check-circle' :
                event.type === EventType.CHANGE_OPERATOR ? 'bi-person' :
                event.type === EventType.NOTE ? 'bi-chat-left-text' : 'bi-calendar-event'
              }`}></i>
              {getEventTitle(event)}
            </EventTitle>
            <EventTime>{formatTime(event.timestamp)}</EventTime>
          </EventHeader>
          <EventDescription>{event.description}</EventDescription>
          {event.note && (
            <EventNote>
              <i className="bi bi-quote me-2"></i>
              {event.note}
            </EventNote>
          )}
        </TimelineEvent>
      ))}
    </TimelineContainer>
  );
};
