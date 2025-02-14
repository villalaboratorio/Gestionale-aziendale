import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/it';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/HomePage/Calendar.css';

moment.locale('it');
const localizer = momentLocalizer(moment);

const LavorazioniCalendar = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLavorazioni();
    }, []);

    const fetchLavorazioni = async () => {
        try {
            const response = await axios.get('/api/dettaglio-lavorazioni');
            const lavorazioni = response.data;
            
            const eventiCalendario = lavorazioni.map(lavorazione => ({
                id: lavorazione._id,
                title: lavorazione.cliente?.nome || 'Cliente N/A',
                start: new Date(lavorazione.dataLavorazione),
                end: new Date(lavorazione.informazioniGenerali?.dataConsegnaPrevista),
                allDay: true,
                resource: lavorazione,
                stato: lavorazione.statoLavorazione?.name,
                isUrgente: lavorazione.informazioniGenerali?.isUrgente
            }));
            
            setEvents(eventiCalendario);
        } catch (error) {
            console.error('Errore nel recupero delle lavorazioni:', error);
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        const title = window.prompt('Inserisci il titolo della nuova lavorazione:');
        if (title) {
            const nuovaLavorazione = {
                dataLavorazione: start.toISOString(),
                completata: false,
                numeroScheda: '',
                cliente: null,
                ricetta: null,
                tipoLavorazione: null,
                statoLavorazione: null,
                informazioniGenerali: {
                    descrizione: title,
                    note: '',
                    dataConsegnaPrevista: end.toISOString(),
                    prioritaCliente: 'media',
                    isUrgente: false,
                    noteUrgenza: '',
                    noteProduzione: '',
                    noteAllergeni: '',
                    noteConfezionamento: '',
                    allergeni: []
                },
                passaggiLavorazione: [],
                assemblaggioIngredienti: {
                    crudo: { ore: '', addetto: '' },
                    dopoCotturaParziale: { ore: '', addetto: '' },
                    dopoCotturaCompleta: { ore: '', addetto: '' },
                    crudoSegueCottura: { ore: '', addetto: '' }
                },
                abbattimentoRaffreddamento: {
                    inizio: '',
                    fine: '',
                    temperatura: '',
                    addetto: ''
                },
                conservazione: {
                    imballaggio: {
                        plastica: false,
                        carta: false,
                        acciaio: false,
                        vetro: false,
                        alluminio: false,
                        sottovuoto: false
                    },
                    metodo: {
                        acqua: false,
                        liquidoGoverno: false,
                        agro: false,
                        olio: false
                    },
                    temperatura: '',
                    inizio: null,
                    fine: null,
                    cella: ''
                }
            };
            
            axios.post('/api/dettaglio-lavorazioni', nuovaLavorazione)
                .then(response => {
                    fetchLavorazioni();
                    navigate(`/dettaglio-lavorazioni/${response.data._id}`);
                })
                .catch(error => console.error('Errore creazione lavorazione:', error));
        }
    };

    const handleSelectEvent = (event) => {
        navigate(`/dettaglio-lavorazioni/${event.id}`);
    };

    const messaggiCalendario = {
        next: "Successivo",
        previous: "Precedente",
        today: "Oggi",
        month: "Mese",
        week: "Settimana",
        day: "Giorno",
        agenda: "Agenda",
        date: "Data",
        time: "Ora",
        event: "Evento",
        noEventsInRange: "Nessuna lavorazione in questo periodo",
        allDay: "Tutto il giorno",
        work_week: "Settimana lavorativa",
        yesterday: 'Ieri',
        tomorrow: 'Domani',
        showMore: total => `+ Altre ${total}`
    };

    const eventStyleGetter = (event) => {
        let style = {
            backgroundColor: '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: 'none',
            display: 'block',
            padding: '2px 5px'
        };

        if (event.isUrgente) {
            style.backgroundColor = '#dc3545';
        } else if (event.stato === 'Completata') {
            style.backgroundColor = '#28a745';
        } else if (event.stato === 'In Attesa') {
            style.backgroundColor = '#ffc107';
            style.color = '#000';
        }

        return { style };
    };

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={['month', 'week', 'day', 'agenda']}
                messages={messaggiCalendario}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                popup
                tooltipAccessor={event => `${event.title}\nStato: ${event.stato}`}
            />
        </div>
    );
};

export default LavorazioniCalendar;
