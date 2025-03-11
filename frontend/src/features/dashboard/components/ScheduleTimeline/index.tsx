import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/endpoints/dashboardApi';
import { DayEvents, ScheduledItem, ScheduleEventApiResponse } from '../../types';
import {
  TimelineContainer,
  TimelineHeader,
  DateNavigator,
  TimelineContent,
  Timeline,
  TimelineDay,
  TimelineSummary,
  TimelineItem,
  TimeItemContent,
  EmptyState,
  LoadingState,
  FilterBar,
  FilterChip,
  EventsCounter,
  ExpandCollapseButton
} from './ScheduleTimeline.styles';

export const ScheduleTimeline: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<DayEvents[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<'week' | 'month'>('week');
  const [dateRange, setDateRange] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Ottieni i giorni della settimana in italiano
  const getItalianDayName = (date: Date): string => {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return days[date.getDay()];
  };
  
  // Formatta data nel formato italiano
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Calcola il periodo corrente (settimana o mese)
  const calculateDateRange = useCallback((period: 'week' | 'month'): { start: Date; end: Date; label: string } => {
    const today = new Date();
    
    if (period === 'week') {
      // Trova il lunedì della settimana corrente
      const startDate = new Date(today);
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // aggiusta quando domenica
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      
      // Trova la domenica della settimana corrente
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      
      return {
        start: startDate,
        end: endDate,
        label: `${formatDate(startDate)} - ${formatDate(endDate)}`
      };
    } else {
      // Primo giorno del mese
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      
      // Ultimo giorno del mese
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      
      return {
        start: startDate,
        end: endDate,
        label: `${startDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`
      };
    }
  }, []);

  // Aggiorna il periodo
  const updatePeriod = (period: 'week' | 'month') => {
    setCurrentPeriod(period);
    const { label } = calculateDateRange(period);
    setDateRange(label);
  };

  // Toggle espansione giorno
  const toggleDayExpansion = (dateKey: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  // Carica gli eventi pianificati
  // Funzione di utilità per date sicure - aggiungila all'inizio del componente
const safeToISOString = (date: Date): string => {
  try {
    if (isNaN(date.getTime())) {
      console.warn('Data non valida:', date);
      return new Date().toISOString(); // Fallback a data corrente
    }
    return date.toISOString();
  } catch (error) {
    console.error('Errore nella conversione a ISO String:', error);
    return new Date().toISOString(); // Fallback a data corrente
  }
};

// Il tuo useEffect con la gestione sicura delle date
useEffect(() => {
  const fetchScheduledEvents = async () => {
    try {
      setLoading(true);
      
      // Ottieni il range di date in modo sicuro
      let { start, end } = calculateDateRange(currentPeriod);
      
      // Verifica la validità delle date
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn('Range date non valido, uso date predefinite');
        // Usa date predefinite come fallback
        const today = new Date();
        start = new Date(today);
        end = new Date(today);
        end.setDate(today.getDate() + 30);
      }
      
      // Usa la funzione sicura per ottenere ISO strings
      const response = await dashboardApi.getSchedule(
        safeToISOString(start),
        safeToISOString(end),
        filter || undefined
      );
      
      // Log per debugging
      console.log("Risposta API completa:", response);
      
      // Verifica risposta valida
      if (response.success && Array.isArray(response.data)) {
        // Ottieni oggi in modo sicuro
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const eventsByDay: Record<string, ScheduledItem[]> = {};
        
        console.log("Numero eventi ricevuti:", response.data.length);
        
        // Elabora ogni evento con gestione robusta degli errori
        response.data.forEach((event: ScheduleEventApiResponse, index: number) => {
          try {
            // Log dei primi eventi per debug
            if (index < 3) {
              console.log(`Evento ${index}:`, event);
              console.log(`Tipo date dell'evento ${index}:`, typeof event.date);
            }
            
            // Verifica se la data esiste
            if (!event.date) {
              console.warn(`Evento ${event._id} senza data valida, saltato`);
              return; // Salta questo evento
            }
            
            // Prova a creare una data valida
            let eventDate: Date;
            
            try {
              // Parsifica la data in modo sicuro
              eventDate = new Date(event.date);
              
              // Verifica validità
              if (isNaN(eventDate.getTime())) {
                throw new Error(`Data non valida: ${event.date}`);
              }
            } catch (dateError) {
              console.warn(`Impossibile parsificare la data per l'evento ${event._id}:`, dateError);
              return; // Salta questo evento
            }
            
            // Crea una chiave di data sicura (YYYY-MM-DD) senza usare toISOString()
            const year = eventDate.getFullYear();
            const month = String(eventDate.getMonth() + 1).padStart(2, '0');
            const day = String(eventDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            if (!eventsByDay[dateKey]) {
              eventsByDay[dateKey] = [];
            }
            
            // Estrai l'ora in modo sicuro
            let formattedTime = "00:00";
            try {
              const timeDate = new Date(event.time || event.date);
              if (!isNaN(timeDate.getTime())) {
                const hours = String(timeDate.getHours()).padStart(2, '0');
                const minutes = String(timeDate.getMinutes()).padStart(2, '0');
                formattedTime = `${hours}:${minutes}`;
              }
            } catch (timeError) {
              console.warn(`Errore nel parsing dell'ora per l'evento ${event._id}:`, timeError);
              // Usa il valore di default già impostato
            }
            
            // Aggiungi l'evento all'array del giorno corrispondente
            eventsByDay[dateKey].push({
              _id: event._id,
              title: event.title || `${event.type || 'Evento'} - ${event.client || 'Cliente'}`,
              time: formattedTime,
              description: event.description || '',
              client: event.client || 'N/D',
              status: event.status || 'scheduled',
              type: event.type || 'altro',
              detailsUrl: event.detailsUrl || `/v2/lavorazione/${event._id}`
            });
          } catch (eventError) {
            console.error(`Errore nell'elaborazione dell'evento ${event._id || index}:`, eventError);
            // Continua con gli altri eventi
          }
        });
        
        // Crea un array di giorni con eventi
        const daysArray: DayEvents[] = [];
        
        // Aggiungi tutti i giorni nel periodo selezionato, anche quelli senza eventi
        let currentDate = new Date(start);
        
        while (currentDate <= end) {
          // Crea la chiave della data in modo sicuro
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;
          
          const dayEvents = eventsByDay[dateKey] || [];
          
          // Ordina gli eventi per orario
          dayEvents.sort((a, b) => {
            return a.time.localeCompare(b.time);
          });
          
          // Verifica se è oggi in modo sicuro
          const isToday = currentDate.getTime() === today.getTime();
          
          // Formatta la data in modo sicuro
          let formattedDate = "";
          try {
            formattedDate = formatDate(currentDate);
          } catch (error) {
            console.error("Errore nel formatDate:", error);
            formattedDate = currentDate.toLocaleDateString();
          }
          
          // Ottieni il nome del giorno in modo sicuro
          let dayName = "";
          try {
            dayName = getItalianDayName(currentDate);
          } catch (error) {
            console.error("Errore nel getItalianDayName:", error);
            dayName = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"][currentDate.getDay()];
          }
          
          daysArray.push({
            date: formattedDate,
            dayName: dayName,
            isToday,
            items: dayEvents
          });
          
          // Passa al giorno successivo in modo sicuro
          const nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + 1);
          currentDate = nextDate;
        }
        
        setDays(daysArray);
        
        // Inizializza l'espansione con i giorni che hanno eventi in modo sicuro
        const initialExpansion: Record<string, boolean> = {};
        
        daysArray.forEach(day => {
          try {
            // Converti la data in formato italiano (dd/mm/yyyy) in formato standard (yyyy-mm-dd)
            const dateParts = day.date.split('/');
            if (dateParts.length !== 3) {
              throw new Error(`Formato data non valido: ${day.date}`);
            }
            
            // Costruisci la data in formato yyyy-mm-dd
            const standardDateStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            const dateObj = new Date(standardDateStr);
            
            if (isNaN(dateObj.getTime())) {
              throw new Error(`Data non valida dopo conversione: ${standardDateStr}`);
            }
            
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dayNum = String(dateObj.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${dayNum}`;
            
            initialExpansion[dateKey] = day.isToday || day.items.length <= 3;
          } catch (error) {
            console.error(`Errore nella creazione della chiave per l'espansione del giorno ${day.date}:`, error);
            // Usa una chiave fallback se necessario
            const fallbackKey = `fallback-${Object.keys(initialExpansion).length}`;
            initialExpansion[fallbackKey] = true;
          }
        });
        
        setExpandedDays(initialExpansion);
      } else {
        console.error('Risposta API non valida:', response);
        setError('Formato risposta non valido');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Errore nel caricamento degli eventi pianificati:', err);
      setError('Impossibile caricare gli eventi pianificati');
      setLoading(false);
    }
  };
  
  fetchScheduledEvents();
}, [currentPeriod, calculateDateRange, filter]);

  
  // Imposta il periodo iniziale
  useEffect(() => {
    const { label } = calculateDateRange(currentPeriod);
    setDateRange(label);
  }, [calculateDateRange, currentPeriod]);
  
  // Filtra per tipo di evento
  const handleFilterChange = (type: string | null) => {
    setFilter(type);
  };
  
  // Icona in base al tipo di evento
  const getEventIcon = (type: string): string => {
    switch(type) {
      case 'lavorazione': return 'fa-industry';
      case 'consegna': return 'fa-truck';
      case 'ricevimento': return 'fa-box';
      default: return 'fa-calendar-day';
    }
  };

  if (loading) {
    return (
      <TimelineContainer>
        <TimelineHeader>
          <h2>Calendario Attività</h2>
        </TimelineHeader>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Caricamento eventi...</p>
        </LoadingState>
      </TimelineContainer>
    );
  }
  
  if (error) {
    return (
      <TimelineContainer>
        <TimelineHeader>
          <h2>Calendario Attività</h2>
        </TimelineHeader>
        <div className="alert alert-danger">
          {error}
        </div>
      </TimelineContainer>
    );
  }

  // Calcola conteggi per tipo di evento
  const eventCounts = {
    lavorazione: days.flatMap(d => d.items.filter(i => i.type === 'lavorazione')).length,
    consegna: days.flatMap(d => d.items.filter(i => i.type === 'consegna')).length,
    ricevimento: days.flatMap(d => d.items.filter(i => i.type === 'ricevimento')).length,
    altro: days.flatMap(d => d.items.filter(i => i.type === 'altro')).length
  };
  
  return (
    <TimelineContainer>
      <TimelineHeader>
        <h2>Calendario Attività</h2>
        <DateNavigator>
          <button 
            onClick={() => updatePeriod('week')} 
            className={currentPeriod === 'week' ? 'active' : ''}
          >
            <i className="fas fa-calendar-week me-1"></i> Settimana
          </button>
          <button 
            onClick={() => updatePeriod('month')} 
            className={currentPeriod === 'month' ? 'active' : ''}
          >
            <i className="fas fa-calendar-alt me-1"></i> Mese
          </button>
          <div className="current-period">
            {dateRange}
          </div>
        </DateNavigator>
      </TimelineHeader>
      
      <FilterBar>
        <FilterChip 
          active={!filter} 
          onClick={() => handleFilterChange(null)}
        >
          <i className="fas fa-calendar-day"></i> Tutti 
          <EventsCounter>{days.flatMap(d => d.items).length}</EventsCounter>
        </FilterChip>
        <FilterChip 
          active={filter === 'lavorazione'} 
          onClick={() => handleFilterChange('lavorazione')}
        >
          <i className="fas fa-industry"></i> Lavorazioni
          <EventsCounter>{eventCounts.lavorazione}</EventsCounter>
        </FilterChip>
        <FilterChip 
          active={filter === 'consegna'} 
          onClick={() => handleFilterChange('consegna')}
        >
          <i className="fas fa-truck"></i> Consegne
          <EventsCounter>{eventCounts.consegna}</EventsCounter>
        </FilterChip>
        <FilterChip 
          active={filter === 'ricevimento'} 
          onClick={() => handleFilterChange('ricevimento')}
        >
          <i className="fas fa-box"></i> Ricevimenti
          <EventsCounter>{eventCounts.ricevimento}</EventsCounter>
        </FilterChip>
      </FilterBar>
      
      <TimelineContent>
        {days.length === 0 || days.every(d => d.items.length === 0) ? (
          <EmptyState>
            <i className="fas fa-calendar-times fa-3x"></i>
            <p>Nessun evento pianificato in questo periodo</p>
          </EmptyState>
        ) : (
          <Timeline>
            {days.map((day, index) => {
// Funzione di utilità sicura per creare dateKey
const createSafeDateKey = (dateString: string): string => {
  try {
    // Se dateString è in formato italiano (dd/mm/yyyy)
    const parts = dateString.split('/');
    
    if (parts.length === 3) {
      // Converti da formato italiano a formato ISO (yyyy-mm-dd)
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      
      // Crea la chiave direttamente senza usare Date object
      return `${year}-${month}-${day}`;
    }
    
    // Fallback - prova a parsificare la data normalmente
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // Se tutto fallisce, crea una chiave unica basata sull'indice
    return `invalid-date-${Math.random().toString(36).substring(2, 9)}`;
  } catch (error) {
    console.error(`Errore nella creazione della chiave per la data: ${dateString}`, error);
    return `error-${Math.random().toString(36).substring(2, 9)}`;
  }
};

// E poi nel JSX, sostituisci la riga problematica con:
const dateKey = createSafeDateKey(day.date);
              const isExpanded = expandedDays[dateKey] || false;
              
              return (
                <TimelineDay key={index}>
                  <div className="day-header">
                    <span className="day-name">{day.dayName}</span>
                    <span className="day-date">{day.date}</span>
                    {day.isToday && <span className="today-badge">Oggi</span>}
                    {day.items.length > 0 && (
                      <span className="event-count">{day.items.length} eventi</span>
                    )}
                  </div>
                  
                  {day.items.length === 0 ? (
                    <TimelineSummary>
                      <span>Nessun evento programmato</span>
                    </TimelineSummary>
                  ) : (
                    <>
                      {day.items.length > 3 && (
                        <ExpandCollapseButton 
                          onClick={() => toggleDayExpansion(dateKey)}
                          isExpanded={isExpanded}
                        >
                          {isExpanded 
                            ? <><i className="fas fa-chevron-up"></i> Riduci</>
                            : <><i className="fas fa-chevron-down"></i> Mostra tutti gli eventi ({day.items.length})</>
                          }
                        </ExpandCollapseButton>
                      )}
                      
                      {/* Se non è espanso e ci sono più di 3 eventi, mostra solo i primi 3 */}
                      {(!isExpanded && day.items.length > 3 
                        ? day.items.slice(0, 3) 
                        : day.items
                      ).map((item, itemIndex) => (
                        <TimelineItem key={itemIndex} status={item.status} eventType={item.type}>
                          <TimeItemContent>
                            <div className="item-header">
                              <h4>{item.title}</h4>
                              <div className="item-time">
                                <i className="fas fa-clock"></i>
                                {item.time}
                              </div>
                            </div>
                            
                            {item.description && (
                              <div className="item-description">
                                {item.description}
                              </div>
                            )}
                            
                            <div className="item-footer">
                              <div className="item-client">
                                <i className={`fas ${getEventIcon(item.type)}`}></i>
                                {item.client}
                              </div>
                              <div className="item-actions">
                                <Link to={item.detailsUrl}>
                                  Dettagli <i className="fas fa-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </TimeItemContent>
                        </TimelineItem>
                      ))}
                      
                      {!isExpanded && day.items.length > 3 && (
                        <ExpandCollapseButton 
                          onClick={() => toggleDayExpansion(dateKey)}
                          isExpanded={false}
                        >
                          <i className="fas fa-chevron-down"></i> Mostra altri {day.items.length - 3} eventi
                        </ExpandCollapseButton>
                      )}
                    </>
                  )}
                </TimelineDay>
              );
            })}
          </Timeline>
        )}
      </TimelineContent>
    </TimelineContainer>
  );
};
